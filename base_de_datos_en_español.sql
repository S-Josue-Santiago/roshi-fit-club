DROP DATABASE IF EXISTS roshi_fit_club;
CREATE DATABASE roshi_fit_club CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE roshi_fit_club;

-- ==========================================
-- TABLA: USUARIOS (Clientes, Admin, Entrenadores)
-- ==========================================
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    hash_contrasena VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('cliente', 'admin', 'entrenador') DEFAULT 'cliente',
    imagen_perfil VARCHAR(255),
    fecha_nacimiento DATE,
    genero ENUM('masculino', 'femenino', 'otro'),
    contacto_emergencia_nombre VARCHAR(100),
    contacto_emergencia_telefono VARCHAR(20),
    condiciones_medicas TEXT,
    objetivos_fitness TEXT,
    nivel_experiencia ENUM('principiante', 'intermedio', 'avanzado') DEFAULT 'principiante',
    tema_preferido ENUM('original', 'futurista', 'resistencia', 'musculo') DEFAULT 'original',
    esta_activo BOOLEAN DEFAULT TRUE,
    email_verificado BOOLEAN DEFAULT FALSE,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: PLANES DE SUSCRIPCIÓN
-- ==========================================
CREATE TABLE planes_suscripcion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_plan VARCHAR(50) NOT NULL,
    tipo_plan ENUM('basico', 'premium', 'vip', 'anual') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    duracion_meses INT DEFAULT 1,
    max_clases_por_mes INT,
    sesiones_entrenamiento_personal INT DEFAULT 0,
    consulta_nutricion BOOLEAN DEFAULT FALSE,
    nivel_acceso_equipo ENUM('basico', 'completo', 'vip') DEFAULT 'basico',
    pases_invitado INT DEFAULT 0,
    reserva_prioritaria BOOLEAN DEFAULT FALSE,
    descripcion TEXT,
    caracteristicas JSON,
    esta_activo BOOLEAN DEFAULT TRUE,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: SUSCRIPCIONES DE USUARIOS
-- ==========================================
CREATE TABLE suscripciones_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    plan_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('activa', 'vencida', 'suspendida', 'cancelada') DEFAULT 'activa',
    auto_renovacion BOOLEAN DEFAULT FALSE,
    metodo_pago ENUM('tarjeta', 'paypal', 'deposito', 'efectivo'),
    monto_total DECIMAL(10,2) NOT NULL,
    descuento_aplicado DECIMAL(10,2) DEFAULT 0,
    clases_usadas INT DEFAULT 0,
    entrenamiento_personal_usado INT DEFAULT 0,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES planes_suscripcion(id),
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: CATEGORÍAS DE PRODUCTOS
-- ==========================================
CREATE TABLE categorias_producto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(50) NOT NULL,
    slug_categoria VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    orden_muestra INT DEFAULT 0,
    esta_activo BOOLEAN DEFAULT TRUE,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: PROVEEDORES (NUEVA)
-- ==========================================
CREATE TABLE proveedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_proveedor VARCHAR(100) NOT NULL,
    contacto_nombre VARCHAR(100),
    contacto_email VARCHAR(100),
    contacto_telefono VARCHAR(20),
    direccion TEXT,
    notas TEXT,
    esta_activo BOOLEAN DEFAULT TRUE,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: PRODUCTOS
-- ==========================================
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_producto VARCHAR(100) NOT NULL,
    slug_producto VARCHAR(100) UNIQUE NOT NULL,
    categoria_id INT NOT NULL,
    marca VARCHAR(50),
    descripcion TEXT,
    descripcion_corta VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2),
    cantidad_stock INT DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    peso DECIMAL(8,2),
    dimensiones VARCHAR(50),
    imagen_producto VARCHAR(255),
    imagenes_galeria JSON,
    info_nutricional JSON,
    ingredientes TEXT,
    instrucciones_uso TEXT,
    advertencias TEXT,
    calificacion DECIMAL(3,2) DEFAULT 0.00,
    total_resenas INT DEFAULT 0,
    es_destacado BOOLEAN DEFAULT FALSE,
    esta_activo BOOLEAN DEFAULT TRUE,
    meta_titulo VARCHAR(150),
    meta_descripcion VARCHAR(300),
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias_producto(id),
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: PRODUCTOS-PROVEEDORES (Relación de costos)
-- ==========================================
CREATE TABLE producto_proveedores (
    producto_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    precio_costo DECIMAL(10,2) NOT NULL,
    fecha_acuerdo DATE,
    PRIMARY KEY (producto_id, proveedor_id),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE
);

-- ==========================================
-- TABLA: SERVICIOS
-- ==========================================
CREATE TABLE servicios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_servicio VARCHAR(100) NOT NULL,
    slug_servicio VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    descripcion_corta VARCHAR(255),
    tipo_servicio ENUM('clase_grupal', 'entrenamiento_personal', 'evaluacion', 'nutricion', 'rehabilitacion'),
    duracion_minutos INT,
    max_participantes INT,
    precio_por_sesion DECIMAL(10,2),
    equipo_requerido TEXT,
    nivel_dificultad ENUM('principiante', 'intermedio', 'avanzado'),
    estimacion_calorias_quemadas INT,
    imagen_servicio VARCHAR(255),
    esta_activo BOOLEAN DEFAULT TRUE,
    requiere_reserva BOOLEAN DEFAULT TRUE,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: HORARIOS DE SERVICIOS
-- ==========================================
CREATE TABLE horarios_servicio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    servicio_id INT NOT NULL,
    entrenador_id INT,
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    capacidad_maxima INT DEFAULT 20,
    ubicacion_sala VARCHAR(50),
    esta_activo BOOLEAN DEFAULT TRUE,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    FOREIGN KEY (entrenador_id) REFERENCES usuarios(id),
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: EQUIPOS
-- ==========================================
CREATE TABLE equipos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_equipo VARCHAR(100) NOT NULL,
    categoria ENUM('cardio', 'fuerza', 'funcional', 'libre', 'especializado'),
    marca VARCHAR(50),
    modelo VARCHAR(50),
    descripcion TEXT,
    imagen_equipo VARCHAR(255),
    fecha_compra DATE,
    vencimiento_garantia DATE,
    programa_mantenimiento ENUM('diaria', 'semanal', 'mensual', 'trimestral'),
    ultimo_mantenimiento DATE,
    proximo_mantenimiento DATE,
    estado ENUM('disponible', 'en_mantenimiento', 'fuera_servicio', 'reservado'),
    ubicacion VARCHAR(50),
    instrucciones_uso TEXT,
    notas_seguridad TEXT,
    capacidad_peso_maximo DECIMAL(8,2),
    requisitos_energia VARCHAR(50),
    dimensiones VARCHAR(100),
    es_destacado BOOLEAN DEFAULT FALSE,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: CARRITO DE COMPRAS
-- ==========================================
CREATE TABLE carrito_compras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_en_momento DECIMAL(10,2) NOT NULL,
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (usuario_id, producto_id)
);

-- ==========================================
-- TABLA: ÓRDENES DE COMPRA (AJUSTADA: Permite usuario_id NULL para invitados)
-- ==========================================
CREATE TABLE ordenes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NULL, -- PERMITE NULL (para compras de invitados/consumidores)
    numero_orden VARCHAR(20) UNIQUE NOT NULL,
    estado ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    estado_pago ENUM('pendiente', 'pagado', 'fallido', 'reembolsado') DEFAULT 'pendiente',
    metodo_pago ENUM('tarjeta', 'paypal', 'deposito', 'efectivo'),
    subtotal DECIMAL(10,2) NOT NULL,
    monto_impuesto DECIMAL(10,2) DEFAULT 0,
    monto_descuento DECIMAL(10,2) DEFAULT 0,
    costo_envio DECIMAL(10,2) DEFAULT 0,
    metodo_entrega ENUM('domicilio', 'recoger_gym') DEFAULT 'domicilio', -- NUEVO: Método de entrega
    monto_total DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'USD',
    billing_address JSON, -- Dirección de facturación (puede ser del invitado)
    shipping_address JSON, -- Dirección de envío (puede ser del invitado)
    notas TEXT,
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: DATOS CONSUMIDOR INVITADO (NUEVA: Para órdenes con usuario_id NULL)
-- ==========================================
CREATE TABLE datos_consumidor_invitado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    orden_id INT UNIQUE NOT NULL, -- Un registro por orden de invitado
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NULL,      -- Opcional
    telefono VARCHAR(20) NULL,    -- Opcional
    direccion_linea_1 VARCHAR(150),
    ciudad VARCHAR(50),
    codigo_postal VARCHAR(20),
    pais VARCHAR(50),
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE
);

-- ==========================================
-- TABLA: GUÍAS DE ENVÍO (NUEVA: Documento ficticio de transporte)
-- ==========================================
CREATE TABLE guias_envio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    orden_id INT UNIQUE NOT NULL, 
    numero_guia VARCHAR(50) UNIQUE NOT NULL, 
    empresa_envio VARCHAR(100) DEFAULT 'Envío Rápido S.A.', 
    destino_pais VARCHAR(50) DEFAULT 'Guatemala', -- Aclaración de envíos
    fecha_envio TIMESTAMP NULL,
    fecha_entrega_estimada DATE NULL,
    estado_envio ENUM('pendiente', 'en_transito', 'entregado', 'fallido') DEFAULT 'pendiente',
    detalles_seguimiento JSON, 
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE
);

-- ==========================================
-- TABLA: DETALLES DE ÓRDENES
-- ==========================================
CREATE TABLE detalles_orden (
    id INT PRIMARY KEY AUTO_INCREMENT,
    orden_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    nombre_producto VARCHAR(100) NOT NULL,
    sku_producto VARCHAR(50),
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- ==========================================
-- TABLA: FACTURAS (NUEVA: Documento de facturación)
-- ==========================================
CREATE TABLE facturas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NULL, -- Puede ser NULL si la factura es para un consumidor invitado
    orden_id INT NULL, -- Enlace a la orden (si la factura es por productos)
    suscripcion_id INT NULL, -- Enlace a la suscripción (si la factura es por membresía)
    numero_factura VARCHAR(50) UNIQUE NOT NULL, 
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE,
    monto_subtotal DECIMAL(10,2) NOT NULL,
    monto_impuesto DECIMAL(10,2) DEFAULT 0,
    monto_total DECIMAL(10,2) NOT NULL,
    estado_factura ENUM('pendiente', 'pagada', 'anulada', 'vencida') DEFAULT 'pendiente',
    metodo_pago ENUM('tarjeta', 'paypal', 'deposito', 'efectivo'),
    notas TEXT,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (orden_id) REFERENCES ordenes(id),
    FOREIGN KEY (suscripcion_id) REFERENCES suscripciones_usuario(id),
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: DETALLES DE FACTURAS (AJUSTADA: Permite facturar Envío)
-- ==========================================
CREATE TABLE facturas_detalle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    factura_id INT NOT NULL,
    tipo_item ENUM('suscripcion', 'producto', 'servicio', 'envio') COMMENT 'Tipo de ítem facturado',
    referencia_id INT NOT NULL, 
    descripcion_item VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    monto_total_linea DECIMAL(10,2) NOT NULL,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE
);

-- ==========================================
-- TABLA: TRANSACCIONES DE PAGO
-- ==========================================
CREATE TABLE transacciones_pago (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    orden_id INT NULL,
    subscription_id INT NULL,
    factura_id INT NULL, -- Nuevo enlace a Facturas
    transaction_type ENUM('suscripcion', 'producto', 'servicio', 'renovacion', 'reembolso'),
    payment_method ENUM('tarjeta', 'paypal', 'deposito', 'efectivo'),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('pendiente', 'completado', 'fallido', 'cancelado', 'reembolsado') DEFAULT 'pendiente',
    transaction_id VARCHAR(100),
    gateway_response JSON,
    reference_number VARCHAR(50),
    notes TEXT,
    processed_at TIMESTAMP NULL,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (orden_id) REFERENCES ordenes(id),
    FOREIGN KEY (subscription_id) REFERENCES suscripciones_usuario(id),
    FOREIGN KEY (factura_id) REFERENCES facturas(id), -- Enlace a facturas
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: RESERVAS DE CLASES
-- ==========================================
CREATE TABLE reservas_clases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    horario_id INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    estado ENUM('confirmada', 'cancelada', 'completada', 'no_asistio') DEFAULT 'confirmada',
    hora_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    razon_cancelacion TEXT,
    registro_entrada BOOLEAN DEFAULT FALSE,
    hora_entrada TIMESTAMP NULL,
    notas TEXT,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (horario_id) REFERENCES horarios_servicio(id),
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_schedule_date (usuario_id, horario_id, fecha_reserva)
);

-- ==========================================
-- TABLA: EVALUACIONES FÍSICAS
-- ==========================================
CREATE TABLE evaluaciones_fisicas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    entrenador_id INT,
    fecha_evaluacion DATE NOT NULL,
    peso DECIMAL(5,2),
    altura DECIMAL(5,2),
    porcentaje_grasa_corporal DECIMAL(4,2),
    masa_muscular DECIMAL(5,2),
    imc DECIMAL(4,2),
    presion_arterial VARCHAR(20),
    frecuencia_cardiaca_reposo INT,
    puntuacion_flexibilidad INT,
    puntuacion_fuerza INT,
    puntuacion_cardio INT,
    notas TEXT,
    recomendaciones TEXT,
    proxima_fecha_evaluacion DATE,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (entrenador_id) REFERENCES usuarios(id),
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: PLANES DE ENTRENAMIENTO
-- ==========================================
CREATE TABLE planes_entrenamiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    entrenador_id INT,
    nombre_plan VARCHAR(100) NOT NULL,
    tipo_plan ENUM('fuerza', 'cardio', 'hiit', 'funcional', 'rehabilitacion', 'personalizado'),
    nivel_dificultad ENUM('principiante', 'intermedio', 'avanzado'),
    duracion_semanas INT DEFAULT 4,
    sesiones_por_semana INT DEFAULT 3,
    objetivos TEXT,
    ejercicios JSON,
    notas TEXT,
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_inicio DATE,
    fecha_fin DATE,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (entrenador_id) REFERENCES usuarios(id),
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: SESIONES DE ENTRENAMIENTO
-- ==========================================
CREATE TABLE sesiones_entrenamiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    plan_id INT,
    fecha_sesion DATE NOT NULL,
    tipo_sesion ENUM('fuerza', 'cardio', 'hiit', 'funcional', 'libre'),
    duracion_minutos INT,
    calorias_quemadas INT,
    ejercicios_completados JSON,
    notas TEXT,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentarios_entrenador TEXT,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES planes_entrenamiento(id),
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: TESTIMONIOS
-- ==========================================
CREATE TABLE testimonios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    titulo VARCHAR(100),
    comentario TEXT NOT NULL,
    imagen_antes VARCHAR(255),
    imagen_despues VARCHAR(255),
    peso_perdido DECIMAL(5,2),
    periodo_tiempo_meses INT,
    es_destacado BOOLEAN DEFAULT FALSE,
    es_aprobado BOOLEAN DEFAULT FALSE,
    fecha_aprobacion TIMESTAMP NULL,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: CONTENIDO DEL SITIO
-- ==========================================
CREATE TABLE contenido_sitio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_contenido ENUM('hero', 'about', 'service', 'product_highlight', 'testimonial', 'blog', 'announcement'),
    titulo VARCHAR(200),
    subtitulo VARCHAR(300),
    contenido TEXT,
    url_imagen VARCHAR(255),
    url_video VARCHAR(255),
    texto_boton VARCHAR(50),
    enlace_boton VARCHAR(200),
    orden_muestra INT DEFAULT 0,
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NULL,
    metadatos JSON,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==========================================
-- TABLA: CONFIGURACIÓN DEL SITIO
-- ==========================================
CREATE TABLE configuracion_sitio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clave_configuracion VARCHAR(50) UNIQUE NOT NULL,
    valor_configuracion TEXT,
    tipo_configuracion ENUM('text', 'number', 'boolean', 'json', 'image') DEFAULT 'text',
    descripcion TEXT,
    es_publico BOOLEAN DEFAULT FALSE,
    creacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cambio_por INT NULL,
    FOREIGN KEY (cambio_por) REFERENCES usuarios(id) ON DELETE SET NULL
);