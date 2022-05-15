import app from './app/app';
import 'dotenv/config';

// Process.env will always be comprised of strings, so we typecast the port to a
// number.
const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
