// import { io } from 'socket.io-client';
import { useSearchParams } from 'react-router-dom';
const { VITE_PORT_EXPRESS } = import.meta.env;

// const socket = io(`ws://localhost:${VITE_PORT_EXPRESS}`);

export default function Update() {
  const [searchParams, setSearchParams] = useSearchParams();

  socket.emit('gps-new', {
    imei: searchParams.get('imei'),
    lat: searchParams.get('lat'),
    lng: searchParams.get('lng'),
  });

  return null;
}
