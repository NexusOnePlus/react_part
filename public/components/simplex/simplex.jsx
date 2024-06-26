import React, { useContext, useState, useEffect } from 'react';
import { MatrixContext } from '../context/context';
import './simplex.css';

const Tablitas = ({ matrix }) => {
  const formatNumber = (num) => {
    let signos = ['<=', '<', '>', '>=', '=']
    if (signos.includes(num)) { return num }
    const number = parseFloat(num);
    if (Number.isInteger(number)) {
      return number;
    } else {
      return number.toFixed(2);
    }
    return num;
  };

  return (
    <div className="pasos">
      {matrix.map((row, rowIndex) => (
        <div className='matrix-table' key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <span className="cell" key={cellIndex}>{cellIndex == 0 || rowIndex == 0 ? cell : formatNumber(cell)} </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const signal = (signos, min) => {
  // console.log(signos)
  if (min) {
    return false;
  }
  let falso = false;
  signos.forEach(
    (signo, index) => {
      if (signo === '<=' && index != 0) {
        falso = true;
      } else {
        falso = false;
      }
    }
  );

  return falso;
}

const tipo = (nuevo) => {
  //formateo de matriz
  let nuevoConIdentidad;
  // if (min) {
  //   let holguras = nuevo.length;
  //   let identidad = Array.from({ length: holguras }, (_, i) =>
  //     Array.from({ length: holguras - 1 }, (_, j) => i === 0 ? 0 : (i - 1 === j ? 1 : 0))
  //   );
  //   nuevoConIdentidad = nuevo.map((fila, i) => {
  //     let colita = fila[fila.length - 1];
  //     let nuevafila = fila.slice(0, -1);
  //     nuevafila = nuevafila.concat(identidad[i]);
  //     nuevafila.push(colita)
  //     return nuevafila;
  //   });
  //   nuevoConIdentidad = nuevoConIdentidad.forEach(
  //     (value, index) => {
  //       if (index > 0) {
  //         value.forEach(
  //           (valor, i) => {
  //             valor = -valor
  //           }
  //         )
  //       }
  //     }
  //   )

  // } else {
  let holguras = nuevo.length;
  let identidad = Array.from({ length: holguras }, (_, i) =>
    Array.from({ length: holguras - 1 }, (_, j) => i === 0 ? 0 : (i - 1 === j ? 1 : 0))
  );
  nuevoConIdentidad = nuevo.map((fila, i) => {
    let colita = fila[fila.length - 1];
    let nuevafila = fila.slice(0, -1);
    nuevafila = nuevafila.concat(identidad[i]);
    nuevafila.push(colita)
    return nuevafila;
  });
  nuevoConIdentidad[0] = nuevoConIdentidad[0].map(valor => -valor);

  // console.log(nuevoConIdentidad);  
  // }

  return nuevoConIdentidad;
}
let barra;
let lado;
const fomateo = (nuevoConIdentidad, filas, columna) => {
  let variables = nuevoConIdentidad[0].length - nuevoConIdentidad.length;
  let a = 1, b = 1, c = 1;
  if (barra == undefined) {barra = Array.from({ length: nuevoConIdentidad[0].length + 1 }, (i, j) => {
    return j < variables ? `X${a++}` : (j == nuevoConIdentidad[0].length - 1 ? '=' : (j == nuevoConIdentidad[0].length ? 'R' : `S${b++}`));
  })
  barra.unshift(' ')
  }

  if(lado == undefined) { lado = Array.from({ length: nuevoConIdentidad.length }, (i, j) => { return j == 0 ? "Z" : `S${c++}` })
  // console.log(undefined)
  }

  if (filas != undefined) {
    // temp[columna+1][0] = temp[0][fila+1]
    lado[columna] = barra[filas+1]
  }
  // let temp = structuredClone(nuevoConIdentidad);
  // console.log("variables",variables, nuevoConIdentidad[0].length)
  // console.log(lado)
  // console.log(barra); 

  let temp = structuredClone(nuevoConIdentidad)
  temp = temp.map((fila, i) => {
    let colita = fila[fila.length - 1];
    let nuevafila = fila.slice(0, -1);
    nuevafila = nuevafila.concat('=');
    nuevafila.push(colita)
    nuevafila.unshift(lado[i])
    return nuevafila;
  })
  temp.unshift(barra)
  // console.log("temp",temp)
  
  return temp
}
const operaciones = (nuevo, signos, matrix, min) => {
  const pasos = [];
  // nuevo = nuevo.map((fila, index) => {
  //   if (index === 0) {
  //     return fila;
  //   }
  //   return fila.map((e) => (e >= 0 ? e : Math.abs(e)));
  // });

  // pasos.push(structuredClone(nuevo))
  let nuevoConIdentidad = tipo(nuevo)
  pasos.push(structuredClone(fomateo(nuevoConIdentidad)));
  let negativos = true;

  while (negativos) {
    let pivote, pivot;
    //eligiendo columna pivote
    for (let j = 0, i = 0, valor = Infinity; j < nuevoConIdentidad[i].length; j++) {
      if (nuevoConIdentidad[i][j] < valor && nuevoConIdentidad[i][j] < 0) {
        valor = nuevoConIdentidad[i][j];
        pivote = j;
      }
    }
    if (pivote == undefined) {
      break
    } else {
      //eligiendo fila pivote
      for (let i = 1, j = pivote, valor = Infinity; i < nuevoConIdentidad.length; i++) {
        if ((nuevoConIdentidad[i][nuevoConIdentidad[i].length - 1] / nuevoConIdentidad[i][j]) < valor && nuevoConIdentidad[i][j] > 0) {
          valor = (nuevoConIdentidad[i][nuevoConIdentidad[i].length - 1] / nuevoConIdentidad[i][j]);
          valor = parseFloat(valor.toFixed(2));
          pivot = i;
        }
      }
      if (pivot != undefined) {
        let realpivot = [...nuevoConIdentidad[pivot]];
        // reduciendo a 1 la fila pivot
        if (realpivot[pivote] != 1) {
          for (let i = 0; i < nuevoConIdentidad[pivot].length; i++) {
            nuevoConIdentidad[pivot][i] = (nuevoConIdentidad[pivot][i] / realpivot[pivote]);
            nuevoConIdentidad[pivot][i] = parseFloat(nuevoConIdentidad[pivot][i].toFixed(2));
          }
        }
        pasos.push(structuredClone(fomateo(nuevoConIdentidad, pivote, pivot)));

        // restaurando cambios a la copia de fila pivot
        realpivot = [...nuevoConIdentidad[pivot]];
        // transformando a 0 la fila z
        let sumaresta = nuevoConIdentidad[0][pivote] * -1;
        for (let i = 0; i < nuevoConIdentidad[0].length; i++) {
          nuevoConIdentidad[0][i] = nuevoConIdentidad[0][i] + (realpivot[i] * (sumaresta));
        }
        pasos.push(structuredClone(fomateo(nuevoConIdentidad,  pivote, pivot)));
        // limpiando la columna pivote
        for (let i = 1; i < nuevoConIdentidad.length; i++) {
          let a = nuevoConIdentidad[i][pivote];
          if (i != pivot && nuevoConIdentidad[i][pivote] != 0) {
            for (let j = 0; j < nuevoConIdentidad[i].length; j++) {
              nuevoConIdentidad[i][j] = nuevoConIdentidad[i][j] - (realpivot[j] * a);
            }
          }
        }
        pasos.push(structuredClone(fomateo(nuevoConIdentidad, pivote, pivot)));
      } else {
        negativos = false
      }
    }
  }

  // pasos.push(matrix);
  return pasos;
};
const Proceso = () => {
  const { matrix } = useContext(MatrixContext);
  const [nuevo, setNuevo] = useState([]);
  const [matrices, setMatrices] = useState([]);
  const [signos, setSignos] = useState([]);
  const { min } = useContext(MatrixContext);
  const [senal, setSenal] = useState(false);

  const modifyMatrix = (matrix) => {
    const newMatrix = [];
    const newSignos = [];

    matrix.forEach(row => {
      const newRow = row.slice(0, -2).concat(row.slice(-1)).map(cell => {
        const parsed = parseInt(cell, 10);
        return isNaN(parsed) ? 0 : parsed;
      });
      newMatrix.push(newRow);
      newSignos.push(row[row.length - 2]);
    });

    setSignos(newSignos);
    setNuevo(newMatrix);
  };

  useEffect(() => {
    if (matrix.length > 0) {
      modifyMatrix(matrix);
    }
  }, [matrix]);

  useEffect(() => {
    if (nuevo.length > 0 && signos.length > 0) {
      setMatrices(operaciones(nuevo, signos, matrix, min));
      setSenal(signal(signos, min));
    }
  }, [nuevo, signos, matrix, min]);

  const getVariableValues = (matrix) => {
    const headers = matrix[0];
    const variableValues = {};

    headers.forEach((header) => {
      if (header.startsWith('X')) {
        variableValues[header] = 0;
      }
    });
    
    matrix.forEach(row => {
      const variable = row[0];
      if (variable.startsWith('X')) {
        variableValues[variable] = row[row.length - 1];
      }
    });
    return variableValues;
  };

  return (
    <div className="proceso">
      <h1 className="titu">SOLUCION SIMPLEX</h1>
      <h2 className="subtitu" style={{ marginBottom: '17px' }}> Tipo de función: {min ? "minimización" : "maximización"}</h2>

      {senal ? (
        matrices.length > 0 ? (
          <>
            <div className="matrices-simplex">
              {matrices.map((mat, index) => (
                <div key={index}>
                  <h3 className="subtitu">Paso {index + 1}</h3>
                  <Tablitas matrix={mat} />
                </div>
              ))}
            </div>
            <h2 style={{ color: 'cyan' }}> Interpretación </h2>
            <div style={{ color: 'white' }}>
              <br />Los resultados serían los siguientes:
              <br /> <br/> Z = {matrices[matrices.length - 1][1][matrices[matrices.length - 1][1].length-1]}
              {Object.entries(getVariableValues(matrices[matrices.length - 1])).map(([variable, value]) => (
                <div key={variable}>
                  {variable} = {value}
                </div>
              ))}
            </div>
          </>
        ) : (
          <h3 className="error">DATA NO ENCONTRADA</h3>
        )
      ) : (
        <h3 className="error">Metodo simplex no adecuado, verifique los signos de las restricciones o tipo de funcion</h3>
      )}
    </div>
  );
};

export default Proceso;