import { createContext, useEffect, useRef, useState } from "react";

export const AppContext = createContext(false);
//ready, value, send
// Make sure to put WebsocketProvider higher up in
// the component tree than any consumers.
export const AppProvider = ({ children }) => {

  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);

  const ws = useRef(null);

  const connect = () => {
    const socket = new WebSocket("ws://192.168.1.108:8080");

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => {
      setIsReady(false);
      setTimeout(() => connect(), 1000);
    };
    socket.onmessage = (event) => setVal(event.data);

    ws.current = socket;
  };

  useEffect(() => {
    connect();
    // Uncomment dit niet graag. Scheelt een hele dag debuggen <3
    return () => {
      ws.current.close();
    };
  }, []);

  const ret = [isReady, val, ws.current?.send.bind(ws.current)];

  return (
    <AppContext.Provider value={ret}>{children}</AppContext.Provider>
  );
};