

DROP TABLE IF EXISTS UserCards;

DROP TABLE IF EXISTS HotelBookings;

DROP TABLE IF EXISTS Bookings;

DROP TABLE IF EXISTS AspNetUserTokens;

DROP TABLE IF EXISTS AspNetUserRoles;

DROP TABLE IF EXISTS AspNetUserLogins;

DROP TABLE IF EXISTS AspNetUserClaims;

DROP TABLE IF EXISTS AspNetRoleClaims;

DROP TABLE IF EXISTS AspNetRoles;

DROP TABLE IF EXISTS AspNetUsers;

DROP TABLE IF EXISTS Hotels;

DROP TABLE IF EXISTS Flights;

DROP TABLE IF EXISTS Users;

DROP TABLE IF EXISTS `__EFMigrationsHistory`;


CREATE TABLE `__EFMigrationsHistory` (
    `MigrationId` VARCHAR(150) NOT NULL,
    `ProductVersion` VARCHAR(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
) CHARACTER SET = utf8mb4;

CREATE TABLE AspNetRoles (
    Id VARCHAR(255) NOT NULL,
    Name VARCHAR(256) NULL,
    NormalizedName VARCHAR(256) NULL,
    ConcurrencyStamp LONGTEXT NULL,
    PRIMARY KEY (Id)
) CHARACTER SET = utf8mb4;

CREATE UNIQUE INDEX RoleNameIndex ON AspNetRoles (NormalizedName);


CREATE TABLE AspNetUsers (
    Id VARCHAR(255) NOT NULL,
    UserName VARCHAR(256) NULL,
    NormalizedUserName VARCHAR(256) NULL,
    Email VARCHAR(256) NULL,
    NormalizedEmail VARCHAR(256) NULL,
    EmailConfirmed TINYINT(1) NOT NULL DEFAULT 1,
    PasswordHash LONGTEXT NULL,
    SecurityStamp LONGTEXT NULL,
    ConcurrencyStamp LONGTEXT NULL,
    PhoneNumber LONGTEXT NULL,
    PhoneNumberConfirmed TINYINT(1) NOT NULL DEFAULT 0,
    TwoFactorEnabled TINYINT(1) NOT NULL DEFAULT 0,
    LockoutEnd DATETIME(6) NULL,
    LockoutEnabled TINYINT(1) NOT NULL DEFAULT 1,
    AccessFailedCount INT NOT NULL DEFAULT 0,
    
    FirstName LONGTEXT NULL,
    LastName LONGTEXT NULL,
    Phone LONGTEXT NULL,
    CreatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    IsBCryptPassword TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (Id)
) CHARACTER SET = utf8mb4;

CREATE INDEX EmailIndex ON AspNetUsers (NormalizedEmail);

CREATE UNIQUE INDEX UserNameIndex ON AspNetUsers (NormalizedUserName);


CREATE TABLE AspNetRoleClaims (
    Id INT NOT NULL AUTO_INCREMENT,
    RoleId VARCHAR(255) NOT NULL,
    ClaimType LONGTEXT NULL,
    ClaimValue LONGTEXT NULL,
    PRIMARY KEY (Id),
    CONSTRAINT FK_AspNetRoleClaims_AspNetRoles_RoleId FOREIGN KEY (RoleId) REFERENCES AspNetRoles (Id) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;

CREATE INDEX IX_AspNetRoleClaims_RoleId ON AspNetRoleClaims (RoleId);


CREATE TABLE AspNetUserClaims (
    Id INT NOT NULL AUTO_INCREMENT,
    UserId VARCHAR(255) NOT NULL,
    ClaimType LONGTEXT NULL,
    ClaimValue LONGTEXT NULL,
    PRIMARY KEY (Id),
    CONSTRAINT FK_AspNetUserClaims_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers (Id) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;

CREATE INDEX IX_AspNetUserClaims_UserId ON AspNetUserClaims (UserId);


CREATE TABLE AspNetUserLogins (
    LoginProvider VARCHAR(255) NOT NULL,
    ProviderKey VARCHAR(255) NOT NULL,
    ProviderDisplayName LONGTEXT NULL,
    UserId VARCHAR(255) NOT NULL,
    PRIMARY KEY (LoginProvider, ProviderKey),
    CONSTRAINT FK_AspNetUserLogins_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers (Id) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;

CREATE INDEX IX_AspNetUserLogins_UserId ON AspNetUserLogins (UserId);


CREATE TABLE AspNetUserRoles (
    UserId VARCHAR(255) NOT NULL,
    RoleId VARCHAR(255) NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_AspNetUserRoles_AspNetRoles_RoleId FOREIGN KEY (RoleId) REFERENCES AspNetRoles (Id) ON DELETE CASCADE,
    CONSTRAINT FK_AspNetUserRoles_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers (Id) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;

CREATE INDEX IX_AspNetUserRoles_RoleId ON AspNetUserRoles (RoleId);


CREATE TABLE AspNetUserTokens (
    UserId VARCHAR(255) NOT NULL,
    LoginProvider VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Value LONGTEXT NULL,
    PRIMARY KEY (UserId, LoginProvider, Name),
    CONSTRAINT FK_AspNetUserTokens_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers (Id) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;


CREATE TABLE Flights (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Airline VARCHAR(255) NOT NULL,
    Logo LONGTEXT NOT NULL,
    `From` VARCHAR(255) NOT NULL,
    `To` VARCHAR(255) NOT NULL,
    Departure VARCHAR(50) NOT NULL,
    Arrival VARCHAR(50) NOT NULL,
    Duration VARCHAR(50) NOT NULL,
    Stops VARCHAR(50) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
    Rating DECIMAL(3, 2) NOT NULL,
    Reviews INT NOT NULL DEFAULT 0,
    MainImage LONGTEXT,
    GalleryImages LONGTEXT,
    Policies LONGTEXT,
    Amenities LONGTEXT,
    TripType VARCHAR(50)
) CHARACTER SET = utf8mb4;


CREATE TABLE Hotels (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Location VARCHAR(255) NOT NULL,
    Type VARCHAR(50),
    Overview LONGTEXT,
    MapUrl LONGTEXT,
    MainImage LONGTEXT,
    GalleryImages LONGTEXT,
    Stars INT NOT NULL CHECK (
        Stars >= 3
        AND Stars <= 5
    ),
    Price DECIMAL(18, 2) NOT NULL,
    Rating DECIMAL(3, 2) NOT NULL,
    Reviews INT NOT NULL DEFAULT 0,
    Amenities LONGTEXT
) CHARACTER SET = utf8mb4;


CREATE TABLE Bookings (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId VARCHAR(450) NOT NULL,
    UserEmail VARCHAR(255) NOT NULL,
    UserName VARCHAR(255),
    FlightId INT NOT NULL,
    BookingDate DATETIME NOT NULL,
    PaymentType VARCHAR(50) DEFAULT 'full',
    TotalPrice DECIMAL(18, 2) NOT NULL,
    Status VARCHAR(50) DEFAULT 'Confirmed',
    TicketNumber VARCHAR(100),
    Gate VARCHAR(50),
    Seat VARCHAR(50),
    CONSTRAINT FK_Bookings_Flights FOREIGN KEY (FlightId) REFERENCES Flights (Id) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;


CREATE TABLE HotelBookings (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId VARCHAR(450) NOT NULL,
    UserEmail VARCHAR(255) NOT NULL,
    UserName VARCHAR(255),
    HotelId INT NOT NULL,
    BookingDate DATETIME NOT NULL,
    CheckIn DATETIME NOT NULL,
    CheckOut DATETIME NOT NULL,
    Nights INT NOT NULL DEFAULT 1,
    RoomType VARCHAR(100) DEFAULT 'Standard Room',
    PaymentType VARCHAR(50) DEFAULT 'full',
    TotalPrice DECIMAL(18, 2) NOT NULL,
    Status VARCHAR(50) DEFAULT 'Confirmed',
    ReservationNumber VARCHAR(100),
    CONSTRAINT FK_HotelBookings_Hotels FOREIGN KEY (HotelId) REFERENCES Hotels (Id) ON DELETE CASCADE
) CHARACTER SET = utf8mb4;


CREATE TABLE UserCards (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId VARCHAR(450) NOT NULL,
    CardHolderName VARCHAR(255) NOT NULL,
    CardNumber VARCHAR(50) NOT NULL,
    ExpiryDate VARCHAR(10) NOT NULL,
    CVC VARCHAR(10) NOT NULL,
    Country VARCHAR(100),
    CardType VARCHAR(20) DEFAULT 'Visa'
) CHARACTER SET = utf8mb4;

INSERT INTO
    AspNetRoles (
        Id,
        Name,
        NormalizedName,
        ConcurrencyStamp
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
    ),
    (
        '20251211153713_IdentitySetup',
        '8.0.11'
    );

SELECT 'Database created successfully!' as Status;

SELECT CONCAT('Total tables: ', COUNT(*)) as Info
FROM information_schema.tables
WHERE
    table_schema = DATABASE();