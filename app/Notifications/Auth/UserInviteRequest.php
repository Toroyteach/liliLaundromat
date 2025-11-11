<?php

namespace App\Notifications\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserInviteRequest extends Notification implements ShouldQueue
{
    use Queueable;


    protected $user;

    /**
     * Create a new notification instance.
     *
     * @param $user
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('User Sign Up Request'))
            ->markdown('emails.teams.send-user-invite-request-notifcation', [
                'userName' => "{$this->user->name}",
                'email' => $this->user->email,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => __('Sign-up request received for :name.', ['name' => $this->user->first_name . ' ' . $this->user->last_name]),
            'user_id' => $this->user->id,
            'email' => $this->user->email,
        ];
    }
}
