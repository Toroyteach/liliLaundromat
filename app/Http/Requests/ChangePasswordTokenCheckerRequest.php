<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ChangePasswordTokenCheckerRequest extends FormRequest
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
            'email' => 'required|email',
            'token' => 'required|numeric|exists:password_reset_tokens'
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => __('Email is required.'),
            'email.email' => __('Enter a valid email.'),
            'token.required' => __('Token is required.'),
            'token.numeric' => __('Token must be numeric.'),
            'token.exists' => __('Invalid or expired token.'),
        ];
    }
}
