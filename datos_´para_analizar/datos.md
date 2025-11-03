Informacion de la base de datos de mysql en aws.
host = database.cfg0weyqopkj.us-east-2.rds.amazonaws.com
port = 3306
usuario = admin
contraseña = 123456789


Informacion render backend
Directorio raíz = ./backend
comando de construccion = npm install && npx prisma generate
comando de inicio = npm run dev
variables: CORS_ORIGIN = https://roshi-fit-club-1.onrender.com
            DATABASE_URL = mysql://admin:123456789@database.cfg0weyqopkj.us-east-2.rds.amazonaws.com:3306/roshi_fit
            JWT_SECRET = ClaveUltraSecretaDeRoshiFitClub

Informacion render frontend
Comando de construcción = npm install && npm run build
Directorio de publicaciones = dist
variables: VITE_API_BASE_URL = https://roshi-fit-cl.onrender.com


Todo estos datos son los unicos que he aplicado. 