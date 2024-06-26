import React from 'react';
import { useEffect, useContext } from 'react';
import { useLocalStorage } from "../context/localstorage";
import { MatrixContext } from '../context/context';
import './planteamiento.css';

const Planteamiento = (props) => {
  let variables = parseInt(props.variables) + 2;
  let restricciones = parseInt(props.restricciones) + 1;
  // cuadros que guardan la informacion en matrices
  const [cuadros, setCuadros] = useLocalStorage('variablesRestricciones',Array.from({ length: restricciones }, () => Array.from({ length: variables }, () => '')));
  
  const { setMatrix } = useContext(MatrixContext); // matriz general

  const {setMin} = useContext(MatrixContext);

  useEffect(() => {
    if (cuadros.length != restricciones || cuadros[0].length != variables){
      setCuadros(Array.from ({ length: restricciones }, () => Array.from({ length: variables }, () => '')));
    }
    setMatrix(cuadros)
    setMin(props.tipo)
  }, [props.variables, props.restricciones, props.tipo]);

  const handleVariableChange = (rowIndex, colIndex, event) => {
    const nuevoCuadro = [...cuadros];
    nuevoCuadro[rowIndex][colIndex] = event.target.value;
    nuevoCuadro[0][variables - 1] = 0;
    nuevoCuadro[0][variables - 2] = '=';
    setCuadros(nuevoCuadro);
    setMatrix(nuevoCuadro);
  };

  return (
      <div className='Subentorno'>
        <h1 className="subTitulo"> PLANTEAMIENTO </h1>
        <div className='Scrollspace'>
        <div className='tablas'>
          {cuadros.map((variablesRestriccion, rowIndex) => (
            <div className="cajaInfo" key={rowIndex}>
              <h1 className='sub2'>
                {rowIndex === 0 
                ? `Funcion Objetivo `
                : `Restriccion ${rowIndex}`}
              </h1 >
              {rowIndex === 0 && 
              <h1 style={{fontSize: '15px', textAlign: 'left', marginBottom: '10px'}}> Tipo de función: {props.tipo ? "minimización" : "maximización"}</h1>
              }
              <div  >
                {variablesRestriccion.map((variable, colIndex) => (
                  <div key={colIndex} className={(rowIndex == 0) & (colIndex == variablesRestriccion.length-1 || colIndex == variablesRestriccion.length-2) ? 'hide' : 'cajitas' } >
                    <span className="input-title">
                      {colIndex === variablesRestriccion.length - 1 ? "Valor: " : (colIndex === variablesRestriccion.length - 2 ? "Signo:" : `X${colIndex + 1}: `)}
                    </span>
                    <input
                      key={colIndex}
                      type="text"
                      placeholder='_____________________'
                      value={rowIndex === 0 && colIndex === variablesRestriccion.length - 2 ? '=' : (rowIndex === 0 && colIndex === variablesRestriccion.length - 1 ? '0' : variable)}
                      onChange={(e) => handleVariableChange(rowIndex, colIndex, e)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
  );
};

export default Planteamiento;
