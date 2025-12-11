

INSERT IGNORE INTO
    `__EFMigrationsHistory` (
        `MigrationId`,
        `ProductVersion`
    )
VALUES (
        '20251205045126_InitialCreate',
        '8.0.11'
    ),
    (
        '20251205052006_MakeFlightFieldsNullable',
        '8.0.11'
    ),
    (
        '20251205052407_FixDecimalPrecision',
        '8.0.11'
    ),
    (
        '20251205053048_MakeBookingFieldsNullable',
        '8.0.11'
    ),
    (
        '20251209031252_AddFlightGallery',
        '8.0.11'
    ),
    (
        '20251209035800_AddTripTypeToFlights',
        '8.0.11'
    ),
    (
        '20251209153532_AddHotelType',
        '8.0.11'
    ),
    (
        '20251209182815_AddUserCards',
        '8.0.11'
    );

CREATE TABLE IF NOT EXISTS `AspNetRoles` (
    `Id` varchar(255) NOT NULL,
    `Name` varchar(256) NULL,
    `NormalizedName` varchar(256) NULL,
    `ConcurrencyStamp` longtext NULL,
    PRIMARY KEY (`Id`)
) CHARACTER SET = utf8mb4;

CREATE UNIQUE INDEX `RoleNameIndex` ON `AspNetRoles` (`NormalizedName`);


CREATE TABLE IF NOT EXISTS `AspNetUsers` (
    `Id` varchar(255) NOT NULL,
    `FirstName` longtext NULL,
    `LastName` longtext NULL,
    `Phone` longtext NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `IsBCryptPassword` tinyint(1) NOT NULL DEFAULT 0,
    `UserName` varchar(256) NULL,
    `NormalizedUserName` varchar(256) NULL,
    `Email` varchar(256) NULL,
    `NormalizedEmail` varchar(256) NULL,
    `EmailConfirmed` tinyint(1) NOT NULL DEFAULT 1,
    `PasswordHash` longtext NULL,
    `SecurityStamp` longtext NULL,
    `ConcurrencyStamp` longtext NULL,
    `PhoneNumber` longtext NULL,
    `PhoneNumberConfirmed` tinyint(1) NOT NULL DEFAULT 0,
    `TwoFactorEnabled` tinyint(1) NOT NULL DEFAULT 0,
    `LockoutEnd` datetime(6) NULL,
    `LockoutEnabled` tinyint(1) NOT NULL DEFAULT 1,
    `AccessFailedCount` int NOT NULL DEFAULT 0,
    PRIMARY KEY (`Id`)
) CHARACTER SET = utf8mb4;

CREATE INDEX `EmailIndex` ON `AspNetUsers` (`NormalizedEmail`);

CREATE UNIQUE INDEX `UserNameIndex` ON `AspNetUsers` (`NormalizedUserName`);


CREATE TABLE IF NOT EXISTS `AspNetRoleClaims` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `RoleId` varchar(255) NOT NULL,
    `ClaimType` longtext NULL,
    `ClaimValue` longtext NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;

CREATE INDEX `IX_AspNetRoleClaims_RoleId` ON `AspNetRoleClaims` (`RoleId`);


CREATE TABLE IF NOT EXISTS `AspNetUserClaims` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UserId` varchar(255) NOT NULL,
    `ClaimType` longtext NULL,
    `ClaimValue` longtext NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;

CREATE INDEX `IX_AspNetUserClaims_UserId` ON `AspNetUserClaims` (`UserId`);


CREATE TABLE IF NOT EXISTS `AspNetUserLogins` (
    `LoginProvider` varchar(255) NOT NULL,
    `ProviderKey` varchar(255) NOT NULL,
    `ProviderDisplayName` longtext NULL,
    `UserId` varchar(255) NOT NULL,
    PRIMARY KEY (
        `LoginProvider`,
        `ProviderKey`
    ),
    CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;

CREATE INDEX `IX_AspNetUserLogins_UserId` ON `AspNetUserLogins` (`UserId`);


CREATE TABLE IF NOT EXISTS `AspNetUserRoles` (
    `UserId` varchar(255) NOT NULL,
    `RoleId` varchar(255) NOT NULL,
    PRIMARY KEY (`UserId`, `RoleId`),
    CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;

CREATE INDEX `IX_AspNetUserRoles_RoleId` ON `AspNetUserRoles` (`RoleId`);


CREATE TABLE IF NOT EXISTS `AspNetUserTokens` (
    `UserId` varchar(255) NOT NULL,
    `LoginProvider` varchar(255) NOT NULL,
    `Name` varchar(255) NOT NULL,
    `Value` longtext NULL,
    PRIMARY KEY (
        `UserId`,
        `LoginProvider`,
        `Name`
    ),
    CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;


INSERT IGNORE INTO
    `AspNetRoles` (
        `Id`,
        `Name`,
        `NormalizedName`,
        `ConcurrencyStamp`
    )
VALUES (
        UUID(),
        'Admin',
        'ADMIN',
        UUID()
    ),
    (
        UUID(),
        'User',
        'USER',
        UUID()
    );

INSERT INTO
    `AspNetUsers` (
        `Id`,
        `UserName`,
        `NormalizedUserName`,
        `Email`,
        `NormalizedEmail`,
        `EmailConfirmed`,
        `PasswordHash`,
        `SecurityStamp`,
        `ConcurrencyStamp`,
        `FirstName`,
        `LastName`,
        `Phone`,
        `PhoneNumber`,
        `CreatedAt`,
        `IsBCryptPassword`,
        `LockoutEnabled`,
        `AccessFailedCount`,
        `PhoneNumberConfirmed`,
        `TwoFactorEnabled`
    )
SELECT
    UUID() as `Id`,
    `Email` as `UserName`,
    UPPER(`Email`) as `NormalizedUserName`,
    `Email`,
    UPPER(`Email`) as `NormalizedEmail`,
    1 as `EmailConfirmed`,
    `PasswordHash`,
    UUID() as `SecurityStamp`,
    UUID() as `ConcurrencyStamp`,
    `FirstName`,
    `LastName`,
    `Phone`,
    `Phone` as `PhoneNumber`,
    `CreatedAt`,
    1 as `IsBCryptPassword`, -- Marca como BCrypt para migração híbrida
    1 as `LockoutEnabled`,
    0 as `AccessFailedCount`,
    0 as `PhoneNumberConfirmed`,
    0 as `TwoFactorEnabled`
FROM `Users`
WHERE
    NOT EXISTS (
        SELECT 1
        FROM `AspNetUsers`
        WHERE
            `Email` = `Users`.`Email`
    );


INSERT INTO
    `AspNetUserRoles` (`UserId`, `RoleId`)
SELECT au.`Id`, (
        SELECT `Id`
        FROM `AspNetRoles`
        WHERE
            `NormalizedName` = 'ADMIN'
        LIMIT 1
    )
FROM `AspNetUsers` au
    INNER JOIN `Users` u ON au.`Email` = u.`Email`
WHERE
    u.`IsAdmin` = 1
    AND NOT EXISTS (
        SELECT 1
        FROM `AspNetUserRoles` aur
        WHERE
            aur.`UserId` = au.`Id`
            AND aur.`RoleId` = (
                SELECT `Id`
                FROM `AspNetRoles`
                WHERE
                    `NormalizedName` = 'ADMIN'
                LIMIT 1
            )
    );


INSERT INTO
    `AspNetUserRoles` (`UserId`, `RoleId`)
SELECT au.`Id`, (
        SELECT `Id`
        FROM `AspNetRoles`
        WHERE
            `NormalizedName` = 'USER'
        LIMIT 1
    )
FROM `AspNetUsers` au
    INNER JOIN `Users` u ON au.`Email` = u.`Email`
WHERE
    u.`IsAdmin` = 0
    AND NOT EXISTS (
        SELECT 1
        FROM `AspNetUserRoles` aur
        WHERE
            aur.`UserId` = au.`Id`
            AND aur.`RoleId` = (
                SELECT `Id`
                FROM `AspNetRoles`
                WHERE
                    `NormalizedName` = 'USER'
                LIMIT 1
            )
    );


SELECT 'Migration para Identity concluída com sucesso!' as Status;

SELECT CONCAT(
        'Total de usuários migrados: ', COUNT(*)
    ) as Info
FROM `AspNetUsers`;

SELECT CONCAT('Total de admins: ', COUNT(*)) as Info
FROM
    `AspNetUserRoles` aur
    INNER JOIN `AspNetRoles` ar ON aur.`RoleId` = ar.`Id`
WHERE
    ar.`NormalizedName` = 'ADMIN';