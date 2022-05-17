import { CourierClient } from '@trycourier/courier';

// TODO: why it doesn't parse?
const courier = CourierClient({
  authorizationToken: process.env.TOKEN || '1',
});

export const sendEmail = async (text: string, title: string): Promise<any> => {
  try {
    const { requestId } = await courier.send({
      message: {
        content: {
          title,
          body: text,
        },
        to: {
          email: process.env.EMAIL_RECIPIENT,
        },
      },
    });
    if (requestId) return { status: true };
    return false;
  } catch (err) {
    console.error(`Courier[sendEmail]: ${JSON.stringify(err)}`);
    return { status: false, error: err.message };
  }
};
