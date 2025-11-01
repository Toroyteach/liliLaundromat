<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id'  => ['required', 'integer', 'exists:customers,id'],
            'user_id'      => ['required', 'integer', 'exists:users,id'],
            'branch_id'    => ['required', 'integer', 'exists:branches,id'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'status'       => ['required', 'string', 'max:255'],
            'due_date'     => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Customer is required.',
            'customer_id.exists'   => 'Customer not found.',
            'user_id.required'     => 'User is required.',
            'user_id.exists'       => 'User not found.',
            'branch_id.required'   => 'Branch is required.',
            'branch_id.exists'     => 'Branch not found.',
            'total_amount.required'=> 'Total amount is required.',
            'total_amount.numeric' => 'Total amount must be numeric.',
            'total_amount.min'     => 'Total amount cannot be negative.',
            'status.required'      => 'Status is required.',
            'status.max'           => 'Status cannot exceed 255 characters.',
            'due_date.date'        => 'Due date must be a valid date format.',
        ];
    }
}
