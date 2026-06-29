export const welcomeEmail = (name, email, password, companyName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nexus</h1>
      </div>
      <div style="padding: 24px; color: #374151;">
        <h2 style="color: #111827; margin-top: 0;">Welcome to Nexus, ${name}!</h2>
        <p>Your account for <strong>${companyName}</strong> has been created successfully.</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Your Login Details:</strong></p>
          <p style="margin: 0 0 4px 0;">Email: <a href="mailto:${email}" style="color: #4F46E5;">${email}</a></p>
          <p style="margin: 0;">Temporary Password: <strong>${password}</strong></p>
        </div>
        <p>Please log in and change your password as soon as possible.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" style="background-color: #4F46E5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Log In to Nexus</a>
        </div>
      </div>
    </div>
  `;
};

export const milestoneCompleteEmail = (clientName, projectTitle, milestoneTitle) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nexus</h1>
      </div>
      <div style="padding: 24px; color: #374151;">
        <h2 style="color: #111827; margin-top: 0;">Milestone Completed!</h2>
        <p>Hello ${clientName},</p>
        <p>We are pleased to inform you that a milestone for your project has been completed.</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Project:</strong> ${projectTitle}</p>
          <p style="margin: 0 0 8px 0;"><strong>Milestone:</strong> ${milestoneTitle}</p>
          <p style="margin: 0;"><strong>Date Completed:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Log in to your Nexus dashboard to view more details.</p>
      </div>
    </div>
  `;
};

export const queryReplyEmail = (clientName, subject, reply) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nexus</h1>
      </div>
      <div style="padding: 24px; color: #374151;">
        <h2 style="color: #111827; margin-top: 0;">Your query has been answered</h2>
        <p>Hello ${clientName},</p>
        <p>An admin has replied to your recent query regarding your project.</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4F46E5;">
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Original Subject: ${subject}</p>
          <p style="margin: 0; font-style: italic;">"${reply}"</p>
        </div>
        <p>If you have any further questions, feel free to reply to the query in your dashboard.</p>
      </div>
    </div>
  `;
};
