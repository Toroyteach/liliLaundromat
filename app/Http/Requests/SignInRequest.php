<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class SignInRequest extends FormRequest
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
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ];
    }

    public function messages()
    {
        return [
            'email.required' => __('The email address is required.'),
            'email.email' => __('Please provide a valid email address.'),
            'password.required' => __('The password field is required.'),
            'password.string' => __('Password must be a string.'),
            'password.min' => __('Password must be at least 6 characters.'),
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        if (request()->header('X-Inertia')) {
            throw new HttpResponseException(
                redirect()->back()
                    ->withErrors($validator->errors())
                    ->withInput()
            );
        }

        $errors = $validator->errors();

        $response = response()->json([
            'message' => __('Invalid data send'),
            'details' => $errors->messages(),
        ], 422);

        throw new HttpResponseException($response);
    }
}
