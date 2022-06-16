import path from 'path';

require('dotenv').config({ path: path.resolve(process.cwd(), '../.env') });

const { DB_HOST, DB_USER, DB_PORT, DB_PASSWORD, DB_NAME } = process.env;

const { Sequelize, DataTypes, Op } = require('sequelize');

// Create connection to postgres
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});

// Define device table
const Device = sequelize.define(
  'device',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    microchip: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

// Define coordinate table
const Coordinate = sequelize.define(
  'coordinate',
  {
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);
Coordinate.belongsTo(Device);

// Define perimeter table
const Perimeter = sequelize.define(
  'perimeter',
  {
    left: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    right: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);
Perimeter.belongsTo(Device);

// Define trip table
const Trip = sequelize.define(
  'trip',
  {
    name: {
      type: DataTypes.STRING,
    },
    start: {
      type: DataTypes.DATE,
    },
    end: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  }
);
Trip.belongsTo(Device);

const User = sequelize.define(
  'admin',
  {
    name: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

// Reset functions

const resetDB = () => {
  return sequelize.sync({ force: true }).then(() => {
    return (Device.create({
      id: 1,
      name: 'admin',
      microchip: 'test',
    })
    .then(() => {
      User.create({
        name: 'Admin',
        phone: '1234567890',
        email: 'admin@admin.admin',
        password: 'admin',
      });
      console.log("not brokey")
    })
  )
  });
};
exports.resetDB = resetDB;

// Coordinate functions

const addCoordinate = (imei: number, lat: number, long: number, time: Date) => {
  return Coordinate.create({
    deviceId: imei,
    latitude: lat,
    longitude: long,
    time: time,
  });
};
exports.addCoordinate = addCoordinate;

const getCoordinate = (imei: number) => {
  return Coordinate.findOne({
    order: [['time', 'DESC']],
    where: { deviceId: imei },
  });
};
exports.getCoordinate = getCoordinate;

// Device functions

const addDevice = (imei: number, name: string = '') => {
  return Device.create({
    id: imei,
    name: name,
  });
};
exports.addDevice = addDevice;

const getDevice = (imei: number) => {
  return Device.findByPk(imei);
};
exports.getDevice = getDevice;

const updateDevice = (imei: number, name: string, microchip: string) => {
  return getDevice(imei).then((data: any) => {
    if (!data) {
      console.log('no data');
      return;
    }
    return data.update({
      name: name,
      microchip: microchip,
    });
  });
};
exports.updateDevice = updateDevice;

const getDevices = () => {
  return Device.findAll();
};
exports.getDevices = getDevices;

// Trip functions

const addTrip = (imei: number, start: Date, name: string = '') => {
  return Trip.create({
    deviceId: imei,
    name: name,
    start: start,
    end: start,
  });
};
exports.addTrip = addTrip;

const getTripsByIMEI = (imei: number) => {
  return Trip.findAll({
    where: {
      deviceId: imei,
    },
  });
};
exports.getTripsByIMEI = getTripsByIMEI;

const updateTrip = (id: number, end: Date) => {
  return Trip.findByPk(id).then((data: any) => {
    return data.update({ end: end });
  });
};
exports.updateTrip = updateTrip;

const getTrips = () => {
  return Trip.findAll();
};
exports.getTrips = getTrips;

const getCoordinatesForTrip = (id: number, imei: number) => {
  return Trip.findByPk(id).then((data: any) => {
    return Coordinate.findAll({
      where: {
        deviceId: imei,
        time: {
          [Op.between]: [data.start, data.end],
        },
      },
    });
  });
};
exports.getCoordinatesForTrip = getCoordinatesForTrip;

// Perimeter functions

const addPerimeter = (imei: number, left: number, right: number) => {
  return Perimeter.create({
    deviceId: imei,
    left: left,
    right: right,
  });
};
exports.addPerimeter = addPerimeter;

const getPerimeterByIMEI = (imei: number) => {
  return Perimeter.findOne({
    order: [['updatedAt', 'DESC']],
    where: { deviceId: imei },
  });
};
exports.getPerimeterByIMEI = getPerimeterByIMEI;

const updatePerimeter = (imei: number, left: number, right: number) => {
  return getPerimeterByIMEI(imei).then((data: any) => {
    return data.update({
      left: left,
      right: right,
    });
  });
};
exports.updatePerimeter = updatePerimeter;

const getPerimeters = () => {
  return Perimeter.findAll();
};
exports.getPerimeters = getPerimeters;

// User functions

const getUser = () => {
  return User.findOne();
};
exports.getUser = getUser;

const updateUser = (name: string, phone: string, email: string, password: string) => {
  return getUser().then((data: any) => {
    return data.update({
      name: name,
      phone: phone,
      email: email,
      password: password,
    });
  });
};
exports.updateUser = updateUser;
