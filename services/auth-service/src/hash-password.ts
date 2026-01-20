import * as bcrypt from 'bcrypt';

async function generateHashedPassword() {
  const plainPassword = 'password123'; // Cambia esta contraseña según lo que necesites
  const salt = await bcrypt.genSalt(); // Genera el salt automáticamente
  const hashedPassword = await bcrypt.hash(plainPassword, salt); // Encripta la contraseña
  console.log('Hashed Password:', hashedPassword); // Imprime el hash generado en la consola
}

// Ejecutamos la función
generateHashedPassword();