import React from 'react';
import AStar from './AStar.js'
import './App.css';

class App extends React.Component {
  state = {
    gridDimension: 5,
    grid: [],
    walls: [],
    start: '',
    end: '',
    total: '',
    error: '',
    clickMode: 'start'
  };

  componentDidMount() {
    this.setGridState()
  }

  setGridState = (num = 5) => {
    let grid = new Array(num)
    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array(num).fill({ wall: false, difficulty: 1, color: 'transparent' })
    }
    return this.setState({
      grid
    })
  }

  setToggleCase = (e, stateKey, color) => {
    let diff = stateKey == "start" ? 0 : 1
    let squarePosition = e.currentTarget.id.split("-")
    Promise.resolve(this.cleanGrid(this.state[stateKey], { wall: false, difficulty: 1, color: 'transparent' }))
      .then(() => this.placeSquare(squarePosition, { wall: false, difficulty: diff, color: color }, stateKey))

  }

  setMultipleSquareCase = (e, stateKey, color) => {
    let wallBoolean = stateKey === "walls" ? true : false
    let difficulty = stateKey === "walls" ? Infinity : 1
    let squarePosition = e.currentTarget.id.split("-")
    this.placeSquares(squarePosition, { wall: wallBoolean, difficulty: difficulty, color: color })

  }

  cleanGrid = (stateCondition, object) => {
    if (!!stateCondition) {
      let grid = this.state.grid
      grid[stateCondition[0]][stateCondition[1]] = object
      return this.setState({
        grid
      })
    }
    return
  }

  substituteSquare = (positionArray, object, key) => {
    let grid = this.state.grid
    grid[positionArray[0]][positionArray[1]] = object
    return this.setState({
      grid,
      [key]: positionArray
    })
  }

  substituteSquares = (positionArray, object) => {
    let grid = this.state.grid
    grid[positionArray[0]][positionArray[1]] = object
    return this.setState({
      grid,
    })
  }

  placeSquare = (squarePosition, object, stateKey) => {
    this.substituteSquare(squarePosition, object, stateKey)
  }

  placeSquares = (squarePosition, object) => {

    this.substituteSquares(squarePosition, object)
  }

  handleClick = (e, clickMode, array = []) => {
    switch (clickMode) {
      case "start":
        this.setToggleCase(e, "start", "green")
        break
      case "end":
        this.setToggleCase(e, "end", "var(--primary-color)")
        break
      case "free":
        this.setMultipleSquareCase(e, "free", "transparent")
        break
      case "wall":
        this.setMultipleSquareCase(e, "walls", "white")
        break
      default:
        return

    }
  }

  renderGrid = () => {
    let grid = this.state.grid
    return <div>{grid.map((row, i) => <div style={{ display: 'flex' }}>{row.map((element, j) => <div data-difficulty={1} id={`${i}-${j}`} onClick={(e) => this.handleClick(e, this.state.clickMode, [i, j])} style={{ height: "100px", overflowX: 'hidden', width: '100px', borderStyle: 'solid', backgroundColor: element.color, fontSize: '50px', lineHeight: '100px', textAlign: 'center' }}>{element.difficulty == 0 ? '' : element.difficulty}</div>)}</div>)}</div>
  }

  reset = async () => {
    await this.setGridState(0)
    this.setGridState(this.state.gridDimension)
  }

  selectMode = (e) => {
    this.setState({
      clickMode: e.target.name
    })
  }

  handleChange = (e) => {
    this.setState({
      gridDimension: Number(e.target.value)
    })
  }

  optimalPath = () => {
    if (!!this.state.start && !!this.state.end) {
      this.setState({
        error: false
      })
    } else {
      return this.setState({
        error: true
      })
    }
    let grid = this.state.grid
    let aStarInstance = new AStar(this.state.start, this.state.end, grid)
    aStarInstance.startAlgorithm()
    let optimalPath = aStarInstance.optimalPath
    let sum = 0

    optimalPath.forEach((node, i) => {
      if (i == 0 || i == optimalPath.length - 1) { return }
      sum += node.difficulty
      let difficulty = grid[node.row][node.col].difficulty
      grid[node.row][node.col] = { color: 'var(--primary-color-soft)', difficulty: difficulty, wall: false }
    })
    return this.setState({
      grid,
      total: sum
    })
  }

  render() {
    return (
      <div className="App-header">
        <div style={{ margin: '30px' }}>
          <div style={{ display: 'flex' }}>

            <button className='btn-principal' name="start" onClick={(e) => this.selectMode(e)}> Seleccionar Inicio </button>
            <button className='btn-principal' name="end" onClick={(e) => this.selectMode(e)}> Seleccionar Destino </button>
            <button className='btn-principal' name="wall" onClick={(e) => this.selectMode(e)}>Seleccionar Muro </button>
            <button className='btn-principal' name="free" onClick={(e) => this.selectMode(e)}>Eliminar Muro </button>
            <button className='btn-principal' onClick={() => this.optimalPath()}> Calcular Ruta </button>

          </div>
          {this.state.error ? <div> Ha ocurrido un error </div> : null}

          {this.renderGrid()}
          {!!this.state.total ? <div> Cantidad de pasos: {this.state.total} </div> : null}
          <button name="dimension" className='btn-principal' value={this.state.gridDimension} onClick={()=>this.reset()}> Limpiar </button>
        </div>
      </div>
    );
  }
}



export default App;