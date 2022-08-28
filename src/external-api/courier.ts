import { CourierClient } from '@trycourier/courier';

const initClient = (authorizationToken: string) => {
  return CourierClient({
    authorizationToken,
  });
};

// TODO: client class
const courier = initClient(process.env.TOKEN);

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
