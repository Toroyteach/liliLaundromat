<?php

namespace App\Notifications\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserInviteRequestSendToken extends Notification implements ShouldQueue
{
    use Queueable;

    protected $link;
    protected $user;

    /**
     * Create a new notification instance.
     *
     * @param string $link
     * @param object $user
     */
    public function __construct(string $link, object $user)
    {
        $this->link = $link;
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
            ->subject(__('Sign Up Request Tokens'))
            ->markdown('emails.auth.send-user-verification-token', [
                'link' => $this->link,
                'userName' => "{$this->user->name}",
                'email' => $this->user->email,
            ]);
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'type' => 'User Invitation Link',
            'user_id' => $this->user->id,
            'user_email' => $this->user->email,
            'user_name' => "{$this->user->name}",
            'team_id' => optional($this->user)->team_id, // Assuming the team ID is optional
            'invite_link' => $this->link,
            'sent_at' => now()->toDateTimeString(),
        ];
    }
}
