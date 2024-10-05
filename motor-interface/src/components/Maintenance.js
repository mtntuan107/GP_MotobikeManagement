import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, notification } from 'antd';
import apiURL from '../api/api';
const { Option } = Select;

const Maintenance = () => {
    const [users, setUsers] = useState([]);
    const [parts, setParts] = useState([]);
    const [maintenanceTypes, setMaintenanceTypes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch users when component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const userRes = await axios.get(`${apiURL}/account/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(userRes.data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (!selectedUser) {
            setParts([]);
            return;
        }

        const fetchParts = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const partRes = await axios.get(`${apiURL}/part_mm/input/`, {
                    params: {
                        user: selectedUser,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setParts(partRes.data);  // Set the parts from the response
            } catch (error) {
                console.error('Error fetching parts for selected user', error);
            }
        };

        fetchParts();
    }, [selectedUser]);

    // Fetch maintenance types
    useEffect(() => {
        const fetchMaintenanceTypes = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const typeRes = await axios.get(`${apiURL}/maintenance_type/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMaintenanceTypes(typeRes.data);  // Set the maintenance types from the response
            } catch (error) {
                console.error('Error fetching maintenance types', error);
            }
        };

        fetchMaintenanceTypes();
    }, []); // Fetch types once when the component mounts

    // Handle form submission
    const handleSubmit = async (values) => {
        const token = localStorage.getItem('access_token');
        setLoading(true);
        try {
            const response = await axios.post(
                `${apiURL}/maintenance/create/`,
                {
                    ...values,
                    user: selectedUser,
                    part: selectedPart,
                    type: selectedType, // Include selected maintenance type
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Show success notification
            notification.success({
                message: 'Success',
                description: 'Maintenance bill created successfully!',
                duration: 2, // Notification will auto-close after 2 seconds
                onClose: () => {
                    window.location.reload(); // Refresh the page when notification is closed
                },
            });

        } catch (error) {
            console.error('Error creating bill', error);
            // Optionally, show error notification
            notification.error({
                message: 'Error',
                description: 'Failed to create maintenance bill. Please try again.',
                duration: 2, // Notification will auto-close after 2 seconds
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Maintenance Bill</h1>
            <Form onFinish={handleSubmit}>
                {/* User Selection */}
                <Form.Item label="User" name="user" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a user"
                        onChange={(value) => {
                            setSelectedUser(value);
                            setSelectedPart(null);  // Reset selected part when user changes
                            setSelectedType(null); // Reset selected type when user changes
                        }}
                        value={selectedUser}
                    >
                        {users.map((user) => (
                            <Option key={user.id} value={user.id}>
                                {user.username}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Part Selection (dependent on selected user) */}
                <Form.Item label="Part" name="part" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a part"
                        onChange={(value) => setSelectedPart(value)}
                        value={selectedPart}
                        disabled={!selectedUser}  // Disable if no user selected
                    >
                        {parts.map((part) => (
                            <Option key={part.id} value={part.id}>
                                {part.name} (Duration: {part.duration} hours)
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Maintenance Type Selection */}
                <Form.Item label="Maintenance Type" name="type" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a maintenance type"
                        onChange={(value) => setSelectedType(value)}
                        value={selectedType}
                        disabled={!parts.length} // Disable if no parts are available
                    >
                        {maintenanceTypes.map((type) => (
                            <Option key={type.id} value={type.id}>
                                {type.name} {/* Assuming type has a name property */}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Additional Input Fields (example: Maintenance Description) */}
                <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                    <Input placeholder="Enter description of maintenance" />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Bill
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Maintenance;
