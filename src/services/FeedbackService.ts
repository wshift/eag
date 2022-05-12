// eslint-disable-next-line import/prefer-default-export
export const sendFeedback = async () => {
  try {
    return true;
  } catch (err) {
    return new Error('Original service unavailable');
  }
};
