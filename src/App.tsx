import * as React from 'react'
import './App.css'
import { StyleSheet, css } from 'aphrodite'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

enum CELL_STATE {
  EMPTY,
  ENEMY_SHIP,
  NEW_SHIP,
  HIT,
  MISS
}

enum GAME_STATE {
  CREATE,
  PLAY,
  PLAY_DONE
}

class BattleshipModel {
  @observable grid: Array<Array<number>>
  gameState: GAME_STATE

  constructor() {
    let grid = new Array()
    for (let i = 0; i < 10; i++) {
      let cells = new Array()
      for (let j = 0; j < 10; j++) {
        cells.push(CELL_STATE.EMPTY)
      }
      grid.push(cells)
    }
    this.grid = grid
    this.createGame()
  }

  createGame() {
    this.gameState = GAME_STATE.PLAY
    let sizes = [5, 4, 4, 3, 2]
    sizes.forEach(size => {
      let added = false
      while (!added) {
        let sx = Math.floor(Math.random() * 10)
        let sy = Math.floor(Math.random() * 10)
        let dx = Math.floor(Math.random() * 3) - 1
        let dy = Math.floor(Math.random() * 3) - 1
        added = this.addShip(size, sx, sy, dx, dy)
      }
    })
  }

  addShip(size: number, sx: number, sy: number, dx: number, dy: number) {
    if (dx === 0 && dy === 0) { return false }
    if (!(dx === 0 || dy === 0)) { return false }
    for (let i = 0; i < size; i++) {
      let cx = sx + (dx * i)
      let cy = sy + (dy * i)
      if (cx < 0 || cx >= this.grid.length) { return false }
      if (cy < 0 || cy >= this.grid.length[0]) { return false }
      if (this.grid[cx][cy] !== CELL_STATE.EMPTY) { return false }
    }
    for (let i = 0; i < size; i++) {
      let cx = sx + (dx * i)
      let cy = sy + (dy * i)
      this.grid[cx][cy] = CELL_STATE.ENEMY_SHIP
    }
    return true
  }

  selectCell(x: number, y: number) {
    if (x < 0 || x >= this.grid.length) { return }
    if (y < 0 || y >= this.grid.length[0]) { return }
    switch (this.gameState) {
      default:
        this.selectCellPlay(x, y)
    }
  }

  selectCellPlay(x: number, y: number) {
    if (this.grid[x][y] === CELL_STATE.ENEMY_SHIP) {
      this.grid[x][y] = CELL_STATE.HIT
    } else if (this.grid[x][y] === CELL_STATE.EMPTY) {
      this.grid[x][y] = CELL_STATE.MISS
    }

  }
}

@observer
class BattleshipBoard extends React.Component<null, { model: BattleshipModel }> {
  constructor() {
    super()
    this.state = { model: new BattleshipModel() }
  }

  cellStyle(x: number, y: number) {
    switch (this.state.model.grid[x][y]) {
      case CELL_STATE.EMPTY:
      case CELL_STATE.ENEMY_SHIP:
        return styles.empty
      default:
      case CELL_STATE.HIT:
        return styles.hit
      case CELL_STATE.MISS:
        return styles.miss
    }
  }

  render() {
    let grid = new Array()
    for (let i = 0; i < 10; i++) {
      let cells = new Array()
      for (let j = 0; j < 10; j++) {
        cells.push(<span
          className={css(styles.cell, this.cellStyle(i, j))}
          onClick={() => { this.state.model.selectCell(i, j) }}
        />)
      }
      grid.push(<div style={{ display: 'flex', flexDirection: 'row' }}>{cells}</div>)
    }
    return <div style={{ display: 'flex', flexDirection: 'column' }}>
      {grid}
    </div>
  }
}

class App extends React.Component<null, null> {
  render() {
    return (
      <div className="App">
        <BattleshipBoard />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  cell: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
  },
  empty: {
    backgroundColor: 'blue',
    ':hover': {
      backgroundColor: 'yellow'
    }
  },
  miss: {
    backgroundColor: 'white',
  },
  ship: {
    backgroundColor: 'grey',
  },
  hit: {
    backgroundColor: 'red',
  }
})

export default App;
