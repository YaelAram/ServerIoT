# Proyecto ServerIoT

En este repositorio contiene el código fuente de un servidor que controla el estado de los actuadores conectados
a un dispostivo ESP32.

## Integrantes

- Castillo Sánchez Yael Aram
- Cruz Ramírez Joshua Rene
- Quijano Cabello Axel

## Planteamiento del problema

Las parrillas Japonesas se caracterizan por proveer al cliente con una parrilla a gas y la comida necesaria para el
mismo se prepare sus alimentos asi como ofrecer un comedor privado, lo que provoca que sea necesario contar con personal
que este constantemente al pendiente de los comedores privados, haya riesgo de detectar una fuga de gas demasiado tarde
por lo aislado y cerrados que suelen ser los comedores privados y que el calor generado por las parillas vuelva
demasiado caliente el interior del comedor.

## Solución propuesta

Implementar un sistema que se encargue de monitorear las condiciones del comedor privado, utilizando los siguientes
sensores y actuadores:

- **Sensor DHT11 y Ventilador**: Para monitorear y controlar la temperatura dentro del comedor.
- **Sensor de Luz (Fotoresistencia) y Led**: Para monitorear y controlar la iluminación dentro del comedor.
- **Sensor MQ2 y Zumbador**: Para monitorear y alertar a los clientes y personal del restaurante que la concentración
  de gas ha supero del limite.
- **Sensor de Presencia y Zumbador**: Para monitorear y alertar al personal del restaurante que el comedor ha sido
  abandonado por el cliente y debe ser limpiado antes de atender al siguiente cliente.

## Instalaciones previas y comandos relevantes

Para poder iniciar el servidor de desarrollo es necesario contar con lo siguiente:

- NodeJS 20 o superior
- NPM

Una vez se cuente con lo anterior es necesario descargar las librerias necesarias para el funcionamiento
del servidor:

```
npm i
```

Para inicar el servidor utiliza el siguiente comando:

```
npm run start
```

## ¿Comó funciona el servidor?

Este servidor cuenta con un solo _endpoint_ de tipo _POST_ el cual se encarga de recibir y validar un objeto
como el siguiente:

```
{
  "gas": boolean,
  "luz": number,
  "pre": boolean
  "temp": number,
}
```

Donde:

- **Gas**: Indica si el sensor de gas detecto una concentración de gas superior al limite dentro de la comedor privado.
- **Luz**: Indica el porcentaje de luz de la comedor privado.
- **Pre**: Indica si el sensor de presencia ha detectado que la comedor privado esta ocupada.
- **Temp**: Indica la temperatura dentro de la comedor privado. El sensor DHT11 solo es capaz de detectar temperaturas
  entre 0 y 50°C.

**Nota: Si el servidor detecta que alguna de las propiedades es de un tipo de dato diferente o esta fuera del rango
de valores validos (en el caso de las propiedades de tipo _number_) el servidor responde con un código de error 400
_BadRequest_.**

Si el servidor no detecta errores en la información de la petición entonces devuelve un _string_ de longitud cuatro
compuesto por unos y ceros que indicaran al ESP32 si debe encender o apagar alguno de los actuadores a los que esta
conectado.

La respuesta se ve de la siguiente forma:

```
"1100"
```

Donde:

- **1**: Indica que el actuador debe ser encendido.
- **0**: Indica que el actuador debe ser apagado.

Ademas, cada posición del _string_ representa uno de los actuadores conectados al ESP32:

- **Posición 1**: Representa el estado del _Zumbador 1 (Actuador del sensor de Gas)_. Si la concentración de gas
  dentro de la comedor privado supero el limite entonces comenzará a emitir un zumbido para alertar a los clientes y al
  personal del restaurante.
- **Posición 2**: Representa el estado del _Led (Actuador del sensor de Luz)_. Si el porcentaje de luz de la
  comedor privado es inferior al 60% entonces enciende el led.
- **Posición 3**: Representa el estado del _Zumbador 2 (Actuador del sensor de Presencia)_. Si se detecta que la
  comedor privado esta vacia entonces comenzará a emitir un zumbido para alertar al personal del restaurante que hay una
  comedor privado que ha sido abandonada por los clientes.
- **Posición 4**: Representa el estado del _Ventilador (Actuador del sensor de Temperatura)_. Si la temperatura de la
  comedor privado es mayor a 30°C enciende el ventilador.
