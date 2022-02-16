import { useState, useEffect, useRef } from "react";
import "./GamePanel.css";
import CountDown from "./CountDown";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Container, Row, Col } from "react-bootstrap";
import { IoReturnUpBack } from "react-icons/io5";
const MySwal = withReactContent(Swal);

function GamePanel(props) {
  let [gameCategory, selectCategory] = useState(props.gameCategory);
  let [display, Setdisplay] = useState(props.gamePanel);
  let [sessionData, SetsessionData] = useState(props.sessionData);
  let [mySessionId, SetmySessionId] = useState(props.mySessionId);
  let [myUserName, SetmyUserName] = useState(props.myUserName);
  let [session, Setsession] = useState(props.session);
  let [publisher, Setpublisher] = useState(props.publisher);
  let [subscribers, Setsubscribers] = useState(props.subscribers);
  let [connectionId, SetconnectionId] = useState(props.connectionId);
  let [connections, Setconnections] = useState(props.connections);
  let [connectionUser, SetconnectionUser] = useState(props.connectionUser);
  let [host, Sethost] = useState(props.host);
  let [isHost, SetisHost] = useState(props.isHost);

  const prevGameCategoryRef = useRef("main");
  const prevGameCategory = prevGameCategoryRef.current;

  useEffect(() => {
    if (props.cnt) {
      selectCategory("countDown");
      prevGameCategoryRef.current = gameCategory;
    } else {
      selectCategory(prevGameCategory);
      prevGameCategoryRef.current = gameCategory;
    }
  }, [props.cnt]);

  useEffect(() => {
    props.gamePanel ? Setdisplay(true) : Setdisplay(false);
  }, [props.gamePanel]);

  useEffect(() => {
    selectCategory(props.gameCategory);
  }, [props.gameCategory]);

  useEffect(() => {
    SetsessionData(props.sessionData);
  }, [props.sessionData]);

  useEffect(() => {
    SetmySessionId(props.mySessionId);
  }, [props.mySessionId]);

  useEffect(() => {
    SetmyUserName(props.myUserName);
  }, [props.myUserName]);

  useEffect(() => {
    Setsession(props.session);
  }, [props.session]);

  useEffect(() => {
    Setpublisher(props.publisher);
  }, [props.publisher]);

  useEffect(() => {
    Setsubscribers(props.subscribers);
  }, [props.subscribers]);

  useEffect(() => {
    SetconnectionId(props.connectionId);
  }, [props.connectionId]);

  useEffect(() => {
    Setconnections(props.connections);
  }, [props.connections]);

  useEffect(() => {
    SetconnectionUser(props.connectionUser);
  }, [props.connectionUser]);

  useEffect(() => {
    Sethost(props.host);
  }, [props.host]);

  useEffect(() => {
    SetisHost(props.isHost);
  }, [props.isHost]);

  //LiarGame Start
  let [liarOrNot, SetLiarOrNot] = useState("");
  let [liar, SetLiar] = useState("");
  let [liarSubject, SetLiarSubject] = useState("");
  let [liarGameState, SetLiarGameState] = useState("main");
  let [userNames, SetUserNames] = useState([]);
  let [liarVote, SetLiarVote] = useState("");
  let [voteResult, SetVoteResult] = useState([]);
  let [isVote, SetIsVote] = useState(false);

  const liarVoteHandler = (e) => {
    e.preventDefault();
    SetLiarVote(e.target.value);
  };
  //LiarGame End

  //UpAndDown Start
  let [gameState, SetGameState] = useState(false);
  let [range, SetRange] = useState(10);
  let [randomNum, SetRandomNum] = useState(5);
  let [upAndDownNum, SetUpAndDownNum] = useState(0);
  let [matchingUpDown, SetMatchingUpDown] = useState("");

  const onChangeRange = (e) => {
    e.preventDefault();
    SetRange(e.target.value);
  };
  const onChangeUpAndDownNum = (e) => {
    e.preventDefault();
    SetUpAndDownNum(e.target.value);
  };
  useEffect(() => {
    SetGameState(gameState);
  }, [gameState]);
  //UpAndDown End

  useEffect(() => {
    receiveSignal();
  }, []);

  useEffect(() => {
    session.on("signal:settingVoteResult", (event) => {
      const voteLiar = event.data;
      var voteResultCopy = [...voteResult];
      voteResultCopy.forEach((val) => {
        if (val.hasOwnProperty(`${voteLiar}`)) val[`${voteLiar}`]++;
      });
      SetVoteResult(voteResultCopy);
    });
  }, [liarVote]);

  return (
    <div className={display ? "panel" : "nondisplay"}>
      <div className="game-header">game panel </div>
      {
        {
          main: (
            <div>
              <div className="title">
                <h>어떤 술게임을 해볼까요?</h>
              </div>
              <div className="games">
                <div
                  onClick={() => {
                    selectCategory("liarGame");
                    props.setGameCategory("liarGame");
                  }}
                >
                  라이어 게임
                </div>
                <div
                  onClick={() => {
                    selectCategory("upAndDown");
                    props.setGameCategory("upAndDown");
                  }}
                >
                  UP & DOWN
                </div>
                <div
                  onClick={() => {
                    selectCategory("baskinrobbins31");
                    props.setGameCategory("baskinrobbins31");
                  }}
                >
                  베스킨 라빈스 31
                </div>
              </div>
            </div>
          ),
          countDown: (
            <div className="countDown">
              <p>스냅샷 카운트 다운!</p>
              <CountDown></CountDown>
            </div>
          ),
          liarGame: (
            <div>
              <div>
                <div className="back btn-font">
                  <IoReturnUpBack
                    size={24}
                    onClick={() => {
                      if (!isHost) {
                        return;
                      } else {
                        selectCategory("main");
                        props.setGameCategory("main");
                        signalSetLiarGameState("main");
                        resetIsVote();
                      }
                    }}
                  />
                  <p>뒤로가기</p>
                </div>
              </div>

              {
                {
                  main: (
                    <div>
                      <br></br>
                      <br></br>
                      <h4 className="liar-title">
                        제시어 카테고리를 선택해주세요!
                      </h4>
                      <Container className="liab-box">
                        <Row
                          className="liar-subject-box"
                          style={{ paddingTop: 10 }}
                        >
                          <Col
                            md={{ span: 4 }}
                            onClick={() => {
                              if (!isHost) {
                                return;
                              } else {
                                selectSubjectCategory("Animal");
                                signalSetLiarGameState("discussion");
                              }
                            }}
                          >
                            동물
                          </Col>
                          <Col
                            md={{ span: 4 }}
                            className="box-blue"
                            onClick={() => {
                              if (!isHost) {
                                return;
                              } else {
                                selectSubjectCategory("Country");
                                signalSetLiarGameState("discussion");
                              }
                            }}
                          >
                            국가
                          </Col>
                          <Col
                            md={{ span: 4 }}
                            onClick={() => {
                              if (!isHost) {
                                return;
                              } else {
                                selectSubjectCategory("Fruit");
                                signalSetLiarGameState("discussion");
                              }
                            }}
                          >
                            과일
                          </Col>
                        </Row>
                        <Row className="liar-subject-box">
                          <Col
                            md={{ span: 4 }}
                            onClick={() => {
                              if (!isHost) {
                                return;
                              } else {
                                selectSubjectCategory("Sports");
                                signalSetLiarGameState("discussion");
                              }
                            }}
                          >
                            스포츠
                          </Col>
                          <Col
                            md={{ span: 4 }}
                            onClick={() => {
                              if (!isHost) {
                                return;
                              } else {
                                selectSubjectCategory("Job");
                                signalSetLiarGameState("discussion");
                              }
                            }}
                          >
                            직업
                          </Col>
                          <Col
                            md={{ span: 4 }}
                            onClick={() => {
                              if (!isHost) {
                                return;
                              } else {
                                selectSubjectCategory("Idol");
                                signalSetLiarGameState("discussion");
                              }
                            }}
                          >
                            아이돌
                          </Col>
                        </Row>
                        <Row className="liar-subject-box">
                          <Col
                            md={{ span: 4 }}
                            onClick={() => {
                              if (!isHost) {
                                return;
                              } else {
                                selectSubjectCategory("Movie");
                                signalSetLiarGameState("discussion");
                              }
                            }}
                          >
                            영화
                          </Col>
                          <Col
                            md={{ span: 4 }}
                            onClick={() => {
                              if (!isHost) {
                                return;
                              } else {
                                selectSubjectCategory("Actor");
                                signalSetLiarGameState("discussion");
                              }
                            }}
                          >
                            한국배우
                          </Col>
                          <Col
                            md={{ span: 4 }}
                            onClick={() => {
                              if (!isHost) {
                                return;
                              } else {
                                selectSubjectCategory("Place");
                                signalSetLiarGameState("discussion");
                              }
                            }}
                          >
                            장소
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  ),
                  discussion: (
                    <div>
                      <p>순서대로 제시어를 설명해주세요</p>
                      <p>순서는 랜덤 입니다!</p>
                      <p>{liarOrNot}</p>
                      <div>
                        {userNames.map((item, index) => {
                          return (
                            <div key={index}>
                              <span>
                                {index + 1}. {item}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => {
                          signalSetLiarGameState("vote");
                        }}
                      >
                        투표 하러 가기
                      </button>
                    </div>
                  ),
                  vote: (
                    <div>
                      <p>
                        방장은 모두의 투표가 완료되었다면 투표 결과 확인 버튼을
                        클릭해주세요!
                      </p>
                      <div>
                        {userNames.map((item, index) => {
                          return (
                            <div>
                              <input
                                type="radio"
                                key={index}
                                value={item}
                                onChange={liarVoteHandler}
                              />
                              {item}
                            </div>
                          );
                        })}
                      </div>
                      {!isVote ? (
                        <div>
                          <button
                            onClick={() => {
                              if (isVote) {
                                return;
                              }
                              sendLiarVote();
                              SetIsVote(true);
                            }}
                          >
                            라이어는 너!
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span></span>
                        </div>
                      )}
                      {isHost ? (
                        <button
                          onClick={() => {
                            if (!isHost) {
                              return;
                            }
                            signalSetLiarGameState("voteResultPage");
                            resetIsVote();
                          }}
                        >
                          투표 결과 확인
                        </button>
                      ) : (
                        <div>
                          <span></span>
                        </div>
                      )}
                    </div>
                  ),
                  voteResultPage: (
                    <div>
                      <p onClick={consoleTest()}>투표 결과!</p>
                      <div>
                        {voteResult.map((item, index) => {
                          return (
                            <div key={index}>
                              <span>
                                {Object.keys(item)} : {Object.values(item)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => {
                          if (!isHost) {
                            return;
                          }
                          signalSetLiarGameState("vote");
                          resetDiscussionOrder();
                        }}
                      >
                        재투표 하기
                      </button>
                      <button
                        onClick={() => {
                          if (!isHost) {
                            return;
                          }
                          signalSetLiarGameState("whoLiar");
                        }}
                      >
                        라이어 확인하기
                      </button>
                    </div>
                  ),
                  whoLiar: (
                    <div>
                      <p>라이어는 바로 {liar} 입니다!</p>
                      <button
                        onClick={() => {
                          if (!isHost) {
                            return;
                          }
                          signalSetLiarGameState("whatSubject");
                        }}
                      >
                        제시어 보기
                      </button>
                    </div>
                  ),
                  whatSubject: (
                    <div>
                      <p>제시어는 {liarSubject}였습니다!</p>
                      <button
                        onClick={() => {
                          if (!isHost) {
                            return;
                          }
                          signalSetLiarGameState("main");
                        }}
                      >
                        라이어 게임 다시하기
                      </button>
                    </div>
                  ),
                }[liarGameState]
              }
            </div>
          ),
          upAndDown: (
            <div>
              <p>UP & DOWN 시작!</p>
              <p
                onClick={() => {
                  selectCategory("main");
                  props.setGameCategory("main");
                  SetMatchingUpDown("");
                  SetGameState(false);
                }}
              >
                게임 선택 돌아가기
              </p>
              <div className="UpAndDown">
                {!gameState ? (
                  <div>
                    <div>범위를 지정해주세요!</div>
                    <div>
                      0부터 몇사이 숫자로?? &#40;9&#60;N&#60;100000&#41;
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="100000"
                        onChange={onChangeRange}
                        value={range}
                      />
                    </div>
                    <div onClick={sendRange}>범위 정하기</div>
                  </div>
                ) : (
                  <div>
                    <div>{randomNum}</div>
                    <div>
                      <input
                        type="number"
                        onChange={onChangeUpAndDownNum}
                        value={upAndDownNum}
                      />
                    </div>
                    <div>{matchingUpDown}</div>
                    <div onClick={sendUpAndDownNum}>숫자 제시하기</div>
                    <div
                      onClick={
                        // SetGameState(false);
                        sendRestart
                      }
                    >
                      Up & Down Game 다시 시작하기!
                    </div>
                  </div>
                )}
              </div>
            </div>
          ),
          baskinrobbins31: (
            <div>
              <p>베스킨라빈스31 시작!</p>
              <p
                onClick={() => {
                  selectCategory("main");
                  props.setGameCategory("main");
                }}
              >
                게임 선택 돌아가기
              </p>
            </div>
          ),
        }[gameCategory]
      }
    </div>
  );

  //=================================Send Signal Start===================================

  //LiarGame Signal Start
  function sendLiarOrNot(subject, urLiar) {
    if (!isHost) {
      return;
    }
    const mySession = session;
    let liarUser = connections.filter(
      (element) => element.connectionId === urLiar.userId
    );
    mySession.signal({
      data: `${subject}, ${"당신은 라이어 입니다"}`,
      to: liarUser,
      type: "pickLiar",
    });

    let notLiarUser = connections.filter(
      (element) => element.connectionId !== urLiar.userId
    );
    mySession.signal({
      data: `${subject}, ${urLiar.userName}`,
      to: notLiarUser,
      type: "liarSubject",
    });

    setDiscussionOrder();
  }

  function signalSetLiarGameState(mode) {
    SetLiarGameState(mode);
    const mySession = session;
    mySession.signal({
      data: mode,
      to: [],
      type: "setLiarGameState",
    });
  }

  function sendDiscussionOrder(usersString) {
    const mySession = session;
    mySession.signal({
      data: usersString,
      to: [],
      type: "setDiscussionOrder",
    });
  }

  function sendLiarVote() {
    const mySession = session;
    mySession.signal({
      data: liarVote,
      to: [],
      type: "settingVoteResult",
    });
  }

  function resetIsVote() {
    const mySession = session;
    mySession.signal({
      data: "resetIsVote",
      to: [],
      type: "resetIsVote",
    });
  }

  function resetLiarVote(usersString) {
    const mySession = session;
    mySession.signal({
      data: usersString,
      to: [],
      type: "resetVoteResult",
    });
  }
  //LiarGame Signal End

  function sendRestart() {
    if (!isHost) {
      return;
    }
    setTimeout(() => {
      SetGameState(() => false);
      SetMatchingUpDown(() => "");
      createRandomNumber(range);
    }, 300);
    const mySession = session;
    // let liarUser = this.state.connections.filter((element) => element.connectionId == this.state.liar.userId);
    mySession.signal({
      data: `${gameState}`,
      to: [],
      type: "setRestart",
    });
  }

  function sendRange() {
    if (!isHost) {
      return;
    }
    setTimeout(() => {
      SetGameState(() => true);
      createRandomNumber(range);
    }, 300);
    const mySession = session;
    // let liarUser = this.state.connections.filter((element) => element.connectionId == this.state.liar.userId);
    mySession.signal({
      data: `${gameState},${range},${randomNum}`,
      to: [],
      type: "setRange",
    });
  }

  function sendUpAndDownNum() {
    if (!isHost) {
      return;
    }
    setTimeout(() => {
      matchUpDown(upAndDownNum);
    }, 300);
    const mySession = session;

    mySession.signal({
      data: `${upAndDownNum},${matchingUpDown}`,
      to: [],
      type: "setUpAndDownNum",
    });
  }
  //=================================Send Signal End==================================

  function receiveSignal() {
    const mySession = session;

    //LiarGame start
    mySession.on("signal:pickLiar", (event) => {
      let Data = event.data.split(",");
      SetLiarSubject(Data[0]);
      SetLiarOrNot(Data[1]);
      SetLiar(myUserName);
      MySwal.fire("당신은 라이어 입니다");
    });

    mySession.on("signal:liarSubject", (event) => {
      let Data = event.data.split(",");
      SetLiarOrNot(() => "제시어는 " + Data[0] + " 입니다");
      SetLiar(Data[1]);
      SetLiarSubject(Data[0]);
      MySwal.fire(`제시어는 ${Data[0]} 입니다`);
    });

    mySession.on("signal:setLiarGameState", (event) => {
      SetLiarGameState(event.data);
    });

    mySession.on("signal:setDiscussionOrder", (event) => {
      const names = event.data.split(",");
      SetUserNames(names);
      let voteList = [];
      for (let i = 0; i < names.length; i++) {
        let voteObj = {};
        voteObj[names[i]] = 0;
        voteList.push(voteObj);
      }
      // if (userNames === []) {
      //   setTimeout
      // }
      console.log("투표리스트", voteList);
      SetVoteResult(voteList);
    });

    mySession.on("signal:resetIsVote", (event) => {
      SetIsVote(false);
      SetLiarVote(liarVote);
    });

    mySession.on("signal:resetVoteResult", (event) => {
      const names = event.data.split(",");
      SetUserNames(names);
      let voteList = [];
      for (let i = 0; i < names.length; i++) {
        let voteObj = {};
        voteObj[names[i]] = 0;
        voteList.push(voteObj);
      }
      // if (userNames === []) {
      //   setTimeout
      // }
      console.log("투표리스트", voteList);
      SetVoteResult(voteList);
    });

    mySession.on("signal:setRange", (event) => {
      event.preventDefault();
      let Data = event.data.split(",");
      console.log("랜덤넘@@@@", Data);
      console.log("랜덤넘1111", gameState, range, randomNum);
      SetGameState(Data[0]);
      SetRange(() => Data[1]);
      SetRandomNum(() => Data[2]);
      console.log("랜덤넘222", gameState, range, randomNum);
      console.log("랜덤넘3333", gameState, range, randomNum);
    });

    mySession.on("signal:setUpAndDownNum", (event) => {
      event.preventDefault();
      let Data = event.data.split(",");
      console.log("셋업", Data);
      SetUpAndDownNum(Data[0]);
      SetMatchingUpDown(Data[1]);
    });

    mySession.on("signal:setRestart", (event) => {
      event.preventDefault();
      SetGameState(() => event.data);
    });
  }

  //LiarGame Start
  function startLiarGame(subjectCategory) {
    if (!isHost) {
      return;
    }
    let urLiar = shuffleArray(connectionUser)[0];

    let subject = shuffleArray(subjectCategory)[0];
    sendLiarOrNot(subject, urLiar);
  }

  function selectSubjectCategory(category) {
    let Animal = [
      "고양이",
      "강아지",
      "캥거루",
      "하마",
      "토끼",
      "쥐",
      "판다",
      "호랑이",
      "원숭이",
      "거북이",
      "얼룩말",
      "늑대",
      "침팬지",
      "낙타",
      "치타",
      "악어",
      "소",
      "고릴라",
      "말",
      "기린",
      "햄스터",
      "수달",
      "다람쥐",
      "사슴",
      "펭귄",
      "고슴도치",
      "여우",
      "돼지",
      "오리",
      "닭",
      "병아리",
      "곰",
      "수달",
      "북극곰",
      "양",
      "알파카",
      "쥐",
      "코끼리",
      "사자",
    ];
    let Country = [
      "한국",
      "중국",
      "일본",
      "러시아",
      "인도",
      "사우디아라비아",
      "시리아",
      "터키",
      "가나",
      "나이지리아",
      "포루투갈",
      "스페인",
      "그리스",
      "이탈리아",
      "영국",
      "스웨덴",
      "체코",
      "폴란드",
      "헝가리",
      "프랑스",
      "독일",
      "스위스",
      "미국",
      "캐나다",
      "멕시코",
      "브라질",
      "아르헨티나",
      "칠레",
      "뉴질랜드",
      "호주",
      "네덜란드",
      "라오스",
      "몽골",
      "미얀마",
    ];
    let Fruit = [
      "사과",
      "포도",
      "복숭아",
      "오렌지",
      "망고",
      "키위",
      "자두",
      "배",
      "리치",
      "딸기",
      "바나나",
      "자몽",
      "석류",
      "블루베리",
      "라즈베리",
      "수박",
      "멜론",
      "파인애플",
      "구아바",
      "코코넛",
      "체리",
      "귤",
      "레몬",
      "참외",
      "감",
      "유자",
      "라임",
      "토마토",
      "살구",
      "홍시",
      "샤인머스켓",
      "한라봉",
      "매실",
    ];
    let Sports = [
      "축구",
      "농구",
      "배구",
      "야구",
      "당구",
      "골프",
      "족구",
      "배드민턴",
      "탁구",
      "테니스",
      "수영",
      "역도",
      "태권도",
      "씨름",
      "유도",
      "복싱",
      "양궁",
      "승마",
      "스케이팅",
      "하키",
      "스키",
      "마라톤",
      "높이뛰기",
      "자전거",
      "탁구",
      "핸드볼",
      "리듬 체조",
      "사격",
      "조정",
      "요트",
      "다이빙",
      "봅슬레이",
      "컬링",
      "경마",
    ];
    let Job = [
      "의사",
      "간호사",
      "경찰관",
      "소방관",
      "과학자",
      "요리사",
      "발레리나",
      "화가",
      "사진가",
      "야구선수",
      "축구선수",
      "가수",
      "판사",
      "농부",
      "선생님",
      "개발자",
      "외교관",
      "국회의원",
      "변호사",
      "변리사",
      "작곡가",
      "패션디자이너",
      "작가",
      "안무가",
      "미용사",
      "기자",
      "배우",
      "모델",
      "아나운서",
      "승무원",
    ];
    let Idol = [
      "트와이스",
      "블랙핑크",
      "(여자)아이들",
      "레드벨벳",
      "있지",
      "브레이브걸스",
      "오마이걸",
      "마마무",
      "여자친구",
      "에이핑크",
      "소녀시대",
      "투에니원",
      "방탄소년단",
      "세븐틴",
      "엑소",
      "비투비",
      "샤이니",
      "블락비",
      "2PM",
      "위너",
      "동방신기",
      "빅뱅",
      "쥬얼리",
      "원더걸스",
      "아이콘",
      "카라",
      "비스트",
      "씨엔블루",
    ];
    let Movie = [
      "어벤져스",
      "매트릭스",
      "라라랜드",
      "메이즈러너",
      "택시운전사",
      "명량",
      "트랜스포머",
      "쏘우",
      "곤지암",
      "반지의 제왕",
      "해리포터",
      "캐리비안의 해적",
      "아바타",
      "실미도",
      "국제시장",
      "타이타닉",
      "극한직업",
      "괴물",
      "킹스맨",
      "겨울왕국",
      "나홀로 집에",
      "신과 함께",
      "아바타",
      "알라딘",
      "부산행",
      "인터스텔라",
      "해운대",
      "설국열차",
      "아이언맨",
    ];
    let Actor = [
      "유아인",
      "류승룡",
      "강동원",
      "원빈",
      "유해진",
      "신하균",
      "최민식",
      "조진웅",
      "이정재",
      "황정민",
      "하정우",
      "정우성",
      "유연석",
      "조정석",
      "성동일",
      "이제훈",
      "김수현",
      "최우식",
      "하지원",
      "박소담",
      "한가인",
      "김혜수",
      "수지",
      "한지민",
      "신민아",
      "손예진",
      "한효주",
      "전지현",
    ];
    let Place = [
      "병원",
      "지하철역",
      "마트",
      "백화점",
      "정류소",
      "미술관",
      "영화관",
      "화장실",
      "엘리베이터",
      "집",
      "공원",
      "카페",
      "음식점",
      "학원",
      "대학교",
      "노래방",
      "술집",
      "헬스장",
      "파티룸",
      "호텔",
      "공장",
      "장례식장",
      "결혼식",
      "회사",
      "교회",
      "절",
      "도로",
    ];

    let subjectCategory = [];

    if (category === "Animal") {
      subjectCategory = [...Animal];
    } else if (category === "Country") {
      subjectCategory = [...Country];
    } else if (category === "Fruit") {
      subjectCategory = [...Fruit];
    } else if (category === "Sports") {
      subjectCategory = [...Sports];
    } else if (category === "Job") {
      subjectCategory = [...Job];
    } else if (category === "Idol") {
      subjectCategory = [...Idol];
    } else if (category === "Movie") {
      subjectCategory = [...Movie];
    } else if (category === "Actor") {
      subjectCategory = [...Actor];
    } else if (category === "Place") {
      subjectCategory = [...Place];
    }
    startLiarGame(subjectCategory);
  }

  function shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (parseInt(i) + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  function setDiscussionOrder() {
    const DiscussionOrder = [...shuffleArray(connectionUser)].map(
      (el) => `${el.userName}`
    );
    const usersString = DiscussionOrder.join(",");
    sendDiscussionOrder(usersString);
  }

  function resetDiscussionOrder() {
    const DiscussionOrder = connectionUser.map((el) => `${el.userName}`);
    const usersString = DiscussionOrder.join(",");
    resetLiarVote(usersString);
  }

  function setLiarVoteList(names) {
    let voteList = [];
    for (let i = 0; i < names.length; i++) {
      let voteObj = {};
      voteObj[names[i]] = 0;
      voteList.push(voteObj);
    }
    // if (userNames === []) {
    //   setTimeout
    // }
    console.log("투표리스트", voteList);
    SetVoteResult(voteList);
  }
  //LiarGame End

  //UpAndDown Start
  function createRandomNumber(num) {
    if (!isHost) {
      return;
    }
    const randomNum = Math.floor(Math.random() * (parseInt(num) + 1));
    SetRandomNum(() => randomNum);
  }
  function matchUpDown(chooseNum) {
    if (!isHost) {
      return;
    }
    if (chooseNum < randomNum) {
      SetMatchingUpDown(() => "UP");
    } else if (chooseNum > randomNum) {
      SetMatchingUpDown(() => "DOWN");
    } else {
      SetMatchingUpDown(() => "맞췄습니다!");
    }
  }
  function consoleTest() {
    console.log("라이어보트#######", liarVote);
    console.log("유저네임즈잘들어갔냐!!!!", userNames);
    console.log("보트결과 잘들어갔냐@@@", voteResult);
  }
  //UpAndDown End
}

export default GamePanel;
