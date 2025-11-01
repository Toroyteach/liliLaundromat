<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        $id = $this->route('id');

        return [
            'name' => 'required|string',
            'email' => 'required|email|string|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'status' => 'required|in:active,suspended',
            'role' => 'required|string',
            'profile_photo_path' => 'nullable|string'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'User name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Invalid email format',
            'email.unique' => 'This email is already registered',
            'password.min' => 'Password must be at least 6 characters',
            'status.required' => 'User status is required',
            'status.in' => 'Status must be active or suspended',
            'role.required' => 'User role is required'
        ];
    }
}
