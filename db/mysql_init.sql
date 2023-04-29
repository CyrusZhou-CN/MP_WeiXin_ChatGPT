USE weixin;

CREATE TABLE system_log (
  `id` INT UNSIGNED AUTO_INCREMENT,
  `level` ENUM('error', 'warn', 'info', 'debug'),
  `fromusername` varchar(64) NULL,
  `tousername` varchar(64) NULL,
  `message` TEXT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE `reply_cache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fromusername` varchar(64) NULL,
  `tousername` varchar(64) NULL,
  `msgId` varchar(64) NOT NULL,
  `responseId` varchar(64) NOT NULL,
  `input` text NOT NULL,
  `reply` text NULL,
  `ask` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expireAt` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `msgId` (`msgId`),
  KEY `expireAt` (`expireAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
