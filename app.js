/****************************************************
 *                   Proyecto (IoT)                  *
 *                                                   *
 *                    Integrantes:                   *
 *             Castillo Sanchez Yael Aram            *
 *              Cruz Ramirez Joshua Rene             *
 *                Quijano Cabello Axel               *
 *                                                   *
 *                   Descripcion:                    *
 *  Este archivo contiene el código fuente de un     *
 *  servidor que controla el estado de los           *
 *  actuadores conectados a un dispostivo ESP32.     *
 *                                                   *
 *****************************************************/

import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';

config(); // Configuramos el acceso a las variables de entorno

const app = express(); // Creamos una nueva instancia de ExpressJS
const PORT = process.env.PORT ?? 8080; // Obtenemos el puerto sobre el cual el servidor va a ser montado

app.use(cors()); // Habilitamos la recepción de peticiones desde cualquier origen
app.use(express.json()); // Agregamos un middleware que facilita la obtencia de información en formato JSON

// Declaramos el endpoint POST en el path /control/
app.post('/control/', (req, res) => {
  const actuadores = []; // Creamos un arreglo, este contiene el estado de los actuadores
  const { gas, luz, pre, temp } = req.body; // Obtenemos la información de los sensores recibida en formato JSON

  // Imprimimos por consola la información recibida
  console.log(`\nBody: \nGas: ${gas} (${typeof gas}), Luz: ${luz} (${typeof luz})`);
  console.log(`Pre: ${pre} (${typeof pre}), Temp: ${temp} (${typeof temp})`);

  // Establecemos que la respuesta sera enviada enviada en formato texto plano
  res.setHeader('Content-Type', 'text/plain');
  // Validamos los tipos y rangos de valores de la información recibida
  if (
    typeof gas !== 'boolean' ||
    typeof luz !== 'number' ||
    luz > 100 ||
    luz < 0 ||
    typeof pre !== 'boolean' ||
    typeof temp !== 'number' ||
    temp > 50 ||
    temp < 0
  ) {
    // Si la información no cumple con las validación notificamos al ESP32
    return res.status(400).send('Rechazada');
  }

  // Si la concentración de gas supera el limite entonces encendemos el actuador, caso contrario lo apagamos
  actuadores.push(gas ? 1 : 0);
  // Si el porcentaje de luz es inferior al 60% entonces encendemos el actuador, caso contrario lo apagamos
  actuadores.push(luz < 60 ? 1 : 0);
  // Si el sensor de presencia no detecta algo entonces encendemos el actuador, caso contrario lo apagamos
  actuadores.push(pre ? 0 : 1);
  // Si la temperatura es mayor a 25°C entonces encendemos el actuador, caso contrario lo apagamos
  actuadores.push(temp > 25 ? 1 : 0);

  // Enviamos la respuesta con el estado de los cuatro actuadores
  return res.status(200).send(actuadores.join(''));
});

// Inicamos el servidor
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
