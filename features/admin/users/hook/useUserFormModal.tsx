import { useEffect, useState } from "react";
import { UserFormModalProps } from "../types/users";
import { CreateUserData, Role, UpdateUserData, UserRole, UserStatus } from "@/types/user";
import { createUser, updateUser } from "@/lib/api/users";

export function useUsersFormModal({ isOpen, onClose, onSuccess, user }: UserFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        address: '',
        date_of_birth: '',
        gender: '',
        avatar: '',
        status: UserStatus.ACTIVE,
        role: UserRole.USER,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditMode = !!user;

    useEffect(() => {
        if (isOpen) {

            if (user) {
                setFormData({
                    full_name: user.full_name || '',
                    email: user.email || '',
                    password: '',
                    address: user.address || '',
                    date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '',
                    gender: user.gender || '',
                    avatar: user.avatar || '',
                    status: user.status,
                    role: user.role,
                });
            } else {
                setFormData({
                    full_name: '',
                    email: '',
                    password: '',
                    address: '',
                    date_of_birth: '',
                    gender: '',
                    avatar: '',
                    status: UserStatus.ACTIVE,
                    role: UserRole.USER,
                });
            }
            setErrors({});
        }
    }, [isOpen, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };


    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!isEditMode && !formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (!isEditMode && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const submitData = {
                ...formData,
                date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth) : undefined,
            };

            console.log(submitData)

            if (isEditMode && user) {
                const updateData: UpdateUserData = { ...submitData };
                await updateUser(user.id, updateData);
            } else {
                const createData: CreateUserData = {
                    ...submitData,
                    password: formData.password
                };
                await createUser(createData);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
            setErrors({ submit: 'Failed to save user. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSubmit,
        handleInputChange,
        isEditMode,
        formData,
        errors,
        loading,
    }
}