<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ForgotPasswordRequest extends FormRequest
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
        ];
    }

    public function messages()
    {
        return [
            'email.required' => __('The email address is required.'),
            'email.email' => __('Please provide a valid email address.'),
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
