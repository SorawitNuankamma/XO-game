import react, { useState, useEffect, useRef } from "react";
import SelectBoardSize from "../components/select-board-size";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

import "../styles/main-page.css";
import MarkElement from "../components/mark-element";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import CheckIcon from "@mui/icons-material/Check";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import SmartToyIcon from "@mui/icons-material/SmartToy";

//Service
import {
  checkWin,
  checkIfCanWin,
  renderWinningBoard,
  getUnmarkNeighbor,
  getUnmarkWinDistance,
  getUnmarkHorizontal,
  getUnmarkVertical,
  getUnmarkLeftDiagonal,
  getUnmarkRightDiagonal,
} from "../services/utility";

import { getReplay, postReplay } from "../services/api";
import axios from "axios";

const RANGE = 100;

const winConditionMapping = {
  1: "Horizontal",
  2: "Vertical",
  3: "LeftDiagonal",
  4: "RightDiagonal",
};

function getRandomInteger(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function duplicateTable(table) {
  let rowsTemplate = [];
  for (let i = 0; i < table.length; i++) {
    // สร้าง template สำหรับแต่ละแถว
    let rowTemplate = [];
    for (let j = 0; j < table[0].length; j++) {
      rowTemplate.push(table[i][j]);
    }
    // push แต่ละแถวเข้าตาราง
    rowsTemplate.push(rowTemplate);
  }
  return rowsTemplate;
}

export default function MainPage() {
  const [range, setRange] = useState([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [rowNumber, setRowNumber] = useState(3);
  const [columnNumber, setColumnNumber] = useState(3);
  // Table State หรือ state ของเกม ณ ขนาดนี้
  const [rows, setRows] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [rowsStyle, setRowsStyle] = useState([
    [``, ``, ``],
    [``, ``, ``],
    [``, ``, ``],
  ]);

  // State ของตาของ player ตอนนี้
  const [player, setPlayer] = useState(1);
  const currentPlayer = useRef(1);
  // State ว่าตอนนี้เริ่มเกมหรือยังไม่เริ่ม
  const [isPlaying, setIsPlaying] = useState(false);
  // State บอกถึงประวัติการเล่นเกมครั้งนี้
  const [gameHistory, setGameHistory] = useState([]);
  const [gameReplay, setGameReplay] = useState(null);
  const [isReplaying, setIsReplaying] = useState(false); // State บอกว่าตอนนี้กำลัง replay อยู่หรือไม่
  const stopReplay = useRef(false);
  const progressValue = useRef(0);
  // State ข้อความ status ในเกม
  const [statusTitle, setStatusTitle] = useState(
    "Click Play to start the game"
  );
  const [statusTitleStyle, setStatusTitleStyle] = useState("blue");
  const round = useRef(1);
  // State บอกว่าเราเล่นกับ Bot
  const [isPlayWithBot, setIsPlayWithBot] = useState(false);
  // State field ของ replay id
  const [replayCodeField, setReplayCodeField] = useState(``);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSelectRow = (event) => {
    setRowNumber(event.target.value);
  };

  const handleSelectColumn = (event) => {
    setColumnNumber(event.target.value);
  };

  const handleLoadReplay = async () => {
    setLoading(true);
    const res = await axios.get(
      `https://murmuring-island-07996.herokuapp.com/api/replays?code=${replayCodeField}`
    );
    if (res.data.data.length === 0) {
      setStatusTitle("Cannot find replay that match corresponding code");
      setStatusTitleStyle(`red`);
    } else {
      setGameReplay(res.data.data[0]);
    }
    setLoading(false);
  };

  const handleReplay = async () => {
    if (isReplaying) {
      stopReplay.current = true;
      setIsReplaying(false);
      return;
    }

    if (
      gameReplay.rowNumber !== rowNumber ||
      gameReplay.columnNumber !== columnNumber
    ) {
      setStatusTitle(
        `Please set the row and column to ${gameReplay.rowNumber} * ${gameReplay.columnNumber}`
      );
      return;
    }
    // create new board
    resetBoard();
    setIsReplaying(true);
    round.current = 1;

    // เริ่มทำการ replay
    //replaying(0);
    for (let i = 0; i < gameReplay.gameHistory.length; i++) {
      await new Promise((done) => setTimeout(() => done(), 1000));
      if (stopReplay.current) {
        break;
      }
      progressValue.current += parseInt(100 / gameReplay.gameHistory.length);
      let turn = gameReplay.gameHistory[i];
      handleClickMark(turn.row, turn.column, 0, turn.player, rows);
    }

    await new Promise((done) => setTimeout(() => done(), 1000));
    progressValue.current = 0;
    setIsReplaying(false);
    stopReplay.current = false;
  };

  const handleSaveReplay = async () => {
    setSaveLoading(true);
    const res = await axios.post(
      `https://murmuring-island-07996.herokuapp.com/api/replays`,
      gameReplay
    );
    if (res.status === 200) {
      setStatusTitle(
        `Successfully save replay with code => ${res.data.data.newReplay.code}`
      );
      setStatusTitleStyle(`green`);
    } else {
      setStatusTitle("Failed on saving replay");
      setStatusTitleStyle(`red`);
    }
    setSaveLoading(false);
  };

  const handleClickMark = (row, column, value, player, rows) => {
    //console.log(rows);
    if (value !== 0) {
      return;
    }
    // แก้ไขค่่าที่ row และ column นั้นๆ
    const rowsTemplate = rows;
    rowsTemplate[row][column] = player;

    let winStatus = checkWin(row, column, rowsTemplate, player);

    // บันทึกลง history
    const gameHistoryTemplate = gameHistory;
    gameHistoryTemplate.push({
      round: round.current,
      player: player,
      row: row,
      column: column,
    });
    setGameHistory(gameHistoryTemplate);
    round.current++;

    // ถ้ามีใครชนะ
    setRows(rowsTemplate);
    if (winStatus.isWining) {
      setStatusTitle(`Player ${player} win`);
      renderWinningBoard(row, column, rowsStyle, winStatus.condition, player);
      console.log();
      handleEndGame(player);
      round.current++;
      return;
    }

    // เสมอในรอบสุดท้ายถ้ายังไม่มีใครแพ้ชนะ
    if (round.current === rowNumber * columnNumber + 1) {
      setStatusTitle(`Draw`);
      handleEndGame(0);
      round.current++;
      return;
    }

    /*
    if (playWithBot) {
      setStatusTitle("Bot turn");
      setStatusTitleStyle("red");
      setPlayer(2);

    }
    */

    if (!isReplaying) {
      if (player === 1) {
        setStatusTitle("Player 2 turn");
        setStatusTitleStyle("red");
        currentPlayer.current = 2;
        setPlayer(2);
      } else {
        setStatusTitle("Player 1 turn");
        setStatusTitleStyle("green");
        currentPlayer.current = 1;
        setPlayer(1);
      }
    }
  };

  const handleEndGame = (player) => {
    // บันทึก history ลง database
    const gameReplay = {
      rowNumber,
      columnNumber,
      playerWin: player,
      gameHistory,
    };
    if (gameHistory.length !== 0) {
      setGameReplay(gameReplay);
    }
    setIsPlaying(false);
    setIsPlayWithBot(false);
    setPlayer(1);
    setGameHistory([]);
    console.log(gameReplay);
  };

  const resetBoard = () => {
    // reset ตัว board ให้อยู่รูปเริ่มต้น
    const rowsTemplate = rows;
    rows.forEach((row, rowIndex) => {
      row.forEach((el, columnIndex) => {
        rowsTemplate[rowIndex][columnIndex] = 0;
      });
    });
    setRows(rowsTemplate);
    // reset ตัว style ของ board ให้อยู่รูปเริ่มต้น
    const rowsStyleTemplate = rowsStyle;
    rowsStyle.forEach((row, rowIndex) => {
      rowsStyle.forEach((el, columnIndex) => {
        rowsStyleTemplate[rowIndex][columnIndex] = ``;
      });
    });
    setRowsStyle(rowsStyleTemplate);
  };

  const handleStartGame = () => {
    round.current = 1;
    setStatusTitle("Player 1 turn");
    setStatusTitleStyle("green");
    // หากเล่นเกมอยู่ยกเลิกเกม
    if (isPlaying) {
      setStatusTitle("Click Play to start the game");
      handleEndGame(0);
      return;
    }

    resetBoard();
    setIsPlaying(true);
  };

  //ComponentDidMount
  useEffect(() => {
    async function initial() {
      let rangeTemplate = [];
      for (let i = 2; i <= RANGE; i++) {
        rangeTemplate.push(i);
      }
      setRange(rangeTemplate);
    }
    initial();
  }, []);

  // สร้าง board Tick-tac-toe จากค่า rowNumber และ columnNumber
  useEffect(() => {
    // สร้าง board ส่วน value
    let rowsTemplate = [];
    for (let i = 0; i < rowNumber; i++) {
      // สร้าง template สำหรับแต่ละแถว
      let rowTemplate = [];
      for (let j = 0; j < columnNumber; j++) {
        rowTemplate.push(0);
      }
      // push แต่ละแถวเข้าตาราง
      rowsTemplate.push(rowTemplate);
    }
    setRows(rowsTemplate);

    // สร้าง board ส่วน styling
    let rowsStyleTemplate = [];
    for (let i = 0; i < rowNumber; i++) {
      // สร้าง template สำหรับแต่ละแถว
      let rowStyleTemplate = [];
      for (let j = 0; j < columnNumber; j++) {
        rowStyleTemplate.push(``);
      }
      // push แต่ละแถวเข้าตาราง
      rowsStyleTemplate.push(rowStyleTemplate);
    }
    setRowsStyle(rowsStyleTemplate);
  }, [rowNumber, columnNumber]);

  const botPeformRandomMark = () => {
    let botRow = 0;
    let botColumn = 0;
    do {
      botRow = getRandomInteger(0, rows.length);
      botColumn = getRandomInteger(0, rows[0].length);
    } while (rows[botRow][botColumn] !== 0);
    handleClickMark(botRow, botColumn, 0, player, rows);
  };

  // should have dependency array
  useEffect(() => {
    //console.log(rows);
    if (isPlayWithBot && player === 2) {
      //console.log(round);
      if (round.current === 2) {
        botPeformRandomMark();
        return;
      }
      // 1) bot ดู move ล่าสุดของเรา
      let neightborPositions = [];
      let botNeightborPositions = [];
      let playerPositions = [];
      let botPositions = [];
      for (let turn of gameHistory) {
        if (turn.player === 1) {
          playerPositions.push(turn);
        } else {
          botPositions.push(turn);
        }
      }

      for (let turn of playerPositions) {
        // ดู move รอบข้างของ move ล่าสุดเรา
        let positions = getUnmarkNeighbor(turn.row, turn.column, rows);
        neightborPositions = [...neightborPositions, ...positions];
      }
      for (let turn of botPositions) {
        // ดู move รอบข้างของ move ล่าสุดเรา
        let positions = getUnmarkNeighbor(turn.row, turn.column, rows);
        botNeightborPositions = [...botNeightborPositions, ...positions];
      }

      // พิจารณาแต่ละจุดรอบข้าง หากจุดนั้นทำให้ bot ( player 2 ) ชนะ จะไปกดจุดนั้น
      //console.log(`bot check each own neighbor`);
      //console.log(botNeightborPositions);
      for (let position of botNeightborPositions) {
        let rowsTemplate = duplicateTable(rows);
        rowsTemplate[position.row][position.column] = 2;
        //console.log(`check at ${position.row} | ${position.column}`);
        let status = checkWin(
          position.row,
          position.column,
          rowsTemplate,
          2,
          true
        );
        //console.log(`check ${position.row} | ${position.column} result ${status.isWining}`);
        if (status.isWining) {
          // Bot จะคลิกที่คาดว่าเราจะชนะ
          handleClickMark(position.row, position.column, 0, player, rows);
          return;
        }
      }

      // พิจารณาแต่ละจุดรอบข้าง หากจุดนั้นทำให้เรา ( player 1 ) ชนะ จะไปกดจุดนั้นแทน
      for (let position of neightborPositions) {
        let rowsTemplate = duplicateTable(rows);
        rowsTemplate[position.row][position.column] = 1;
        let status = checkWin(
          position.row,
          position.column,
          rowsTemplate,
          1,
          true
        );
        if (status.isWining) {
          // Bot จะคลิกที่คาดว่าเราจะชนะ
          handleClickMark(position.row, position.column, 0, player, rows);
          return;
        }
      }

      let previousBotMove = gameHistory[gameHistory.length - 2];
      // ถ้าไม่มี พิจารณาจุดตัวเองว่าทิศไหนทำให้ตัวเองชนะได้
      let winAxis = checkIfCanWin(
        previousBotMove.row,
        previousBotMove.column,
        rows,
        1
      );

      console.log(winAxis);
      // ถ้าไม่มีทิศใหนสามารถทำให้ชนะได้ สุ่มคลิกตำแหน่งใหม่
      if (
        !winAxis.canWinHorizontal &&
        !winAxis.canWinVertical &&
        !winAxis.canWinLeftDiagonal &&
        !winAxis.canWinRightDiagonal
      ) {
        console.log("bot can't win on this position");
        botPeformRandomMark();
        return;
      }

      do {
        let direction = getRandomInteger(1, 5);
        if (direction === 1 && winAxis.canWinHorizontal) {
          let positions = getUnmarkHorizontal(
            previousBotMove.row,
            previousBotMove.column,
            rows
          );
          //console.log(positions);
          let pickedPosition = positions[getRandomInteger(0, positions.length)];
          handleClickMark(
            pickedPosition.row,
            pickedPosition.column,
            0,
            player,
            rows
          );
          break;
        }
        if (direction === 2 && winAxis.canWinVertical) {
          let positions = getUnmarkVertical(
            previousBotMove.row,
            previousBotMove.column,
            rows
          );
          let pickedPosition = positions[getRandomInteger(0, positions.length)];
          handleClickMark(
            pickedPosition.row,
            pickedPosition.column,
            0,
            player,
            rows
          );
          //console.log(positions);
          break;
        }
        if (direction === 3 && winAxis.canWinLeftDiagonal) {
          let positions = getUnmarkLeftDiagonal(
            previousBotMove.row,
            previousBotMove.column,
            rows
          );
          let pickedPosition = positions[getRandomInteger(0, positions.length)];
          handleClickMark(
            pickedPosition.row,
            pickedPosition.column,
            0,
            player,
            rows
          );
          //console.log(positions);
          break;
        }
        if (direction === 4 && winAxis.canWinRightDiagonal) {
          let positions = getUnmarkRightDiagonal(
            previousBotMove.row,
            previousBotMove.column,
            rows
          );
          let pickedPosition = positions[getRandomInteger(0, positions.length)];
          handleClickMark(
            pickedPosition.row,
            pickedPosition.column,
            0,
            player,
            rows
          );
          //console.log(positions);
          break;
        }
      } while (true);
    }
  });

  return (
    <div className="page">
      <div className="content font-roboto">
        <div>
          <div className="title">XO Game </div>
          <div className="divider">
            <Divider />
          </div>
          <div className={`game-title ${statusTitleStyle}`}>
            <ArrowForwardIosIcon />
            {statusTitle}
            {isReplaying && (
              <div className="progress">
                <LinearProgress
                  variant="determinate"
                  value={progressValue.current}
                />
              </div>
            )}
            {isReplaying && (
              <span className="round-number">
                {progressValue.current === 100
                  ? "finish"
                  : `round ${round.current}/${
                      gameReplay.gameHistory.length + 1
                    }`}
              </span>
            )}
          </div>
        </div>
        <div className="container">
          <span className="font-roboto label">Select Table Size</span>
          <SelectBoardSize
            disabled={isPlaying || isReplaying}
            label="Row"
            value={rowNumber}
            values={range}
            callback={handleSelectRow}
          />
          <CloseIcon />
          <SelectBoardSize
            disabled={isPlaying || isReplaying}
            label="Column"
            value={columnNumber}
            values={range}
            callback={handleSelectColumn}
          />
          <Button
            disabled={isReplaying || isPlayWithBot}
            variant="contained"
            size="large"
            color={isPlaying ? "error" : "primary"}
            disableElevation
            onClick={handleStartGame}
          >
            {isPlaying ? "End" : "Play"}
          </Button>
          <Button
            disabled={isPlaying && !isPlayWithBot}
            variant="contained"
            size="large"
            color={isPlaying ? "error" : "primary"}
            disableElevation
            endIcon={<SmartToyIcon />}
            onClick={() => {
              setIsPlayWithBot(true);
              handleStartGame();
            }}
          >
            {isPlayWithBot ? "End" : "Play with AI"}
          </Button>
        </div>
        <div className="container-2">
          <span className="font-roboto label">Replay</span>
          <Button
            disabled={isPlaying || !gameReplay || isReplaying}
            variant="contained"
            size="large"
            color={isReplaying ? "error" : "primary"}
            disableElevation
            onClick={handleReplay}
          >
            {"start replay"}
          </Button>
          <LoadingButton
            disabled={isReplaying || !gameReplay || isPlaying}
            onClick={handleSaveReplay}
            endIcon={<SaveIcon />}
            loading={saveLoading}
            loadingPosition="end"
            size="large"
            variant="contained"
            color="success"
          >
            Save Replay
          </LoadingButton>
        </div>
        <div className="container-3">
          <span className="font-roboto label">Load replay</span>
          <LoadingButton
            disabled={replayCodeField ? false : true}
            onClick={handleLoadReplay}
            loading={loading}
            size="large"
            variant="outlined"
          >
            {"Load replay"}
          </LoadingButton>
          <TextField
            id="standard-basic"
            label="Replay Code"
            variant="standard"
            value={replayCodeField}
            onChange={(event) => {
              setReplayCodeField(event.target.value);
            }}
          />
        </div>
        <div className="gameboard">
          {rows.map((row, rowIndex) => {
            return (
              <div key={rowIndex} className="flex">
                {row.map((el, columnIndex) => {
                  return (
                    <MarkElement
                      disabled={
                        isReplaying ||
                        !isPlaying ||
                        (isPlayWithBot && player === 2)
                      }
                      player={player}
                      rows={rows}
                      key={columnIndex}
                      position={{
                        row: rowIndex,
                        column: columnIndex,
                      }}
                      value={rows[rowIndex][columnIndex]}
                      style={rowsStyle[rowIndex][columnIndex]}
                      callback={handleClickMark}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
