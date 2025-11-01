<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
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
    public function rules()
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'phone'         => ['required', 'string', 'max:50', 'unique:customers,phone,' . $this->customer->id],
            'email'         => ['nullable', 'email', 'max:255'],
            'address'       => ['nullable', 'string'],
            'loyalty_points'=> ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages()
    {
        return [
            'name.required'     => 'Customer name is required.',
            'phone.required'    => 'Phone is required.',
            'phone.unique'      => 'This phone number is already taken by another customer.',
            'email.email'       => 'Email format is invalid.',
        ];
    }
}
