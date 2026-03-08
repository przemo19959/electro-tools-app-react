import viteLogo from "../../../public/vite.svg";
import reactLogo from "../../assets/react.svg";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../components/alert-stack/alert-stack-slice";
import type { AlertItem } from "../../components/alert-stack/types";

export const Home = () => {
  const [count, setCount] = useState(0);

  const dispatch = useAppDispatch();

  const spawnAlert = () => {
    dispatch(addAlert({
      id: new Date().getTime(),
      type: ['success', 'info', 'warning', 'error'][Math.floor(Math.random() * 4)] as AlertItem['type'],
      message: `Random alert ${Math.floor(Math.random() * 100)} aaaaaaaaaaaaaa much longer text to test multiline support`,
    }));
  }

  console.log('Home');
  
  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {
          setCount((count) => count + 1);
          spawnAlert();
        }}>
          count is {count} hehe
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}