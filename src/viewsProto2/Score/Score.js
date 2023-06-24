import React, { useState, useEffect, createRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';
import AudioPlayer from 'react-h5-audio-player';

import AppNavbar from '../../components/AppNavbar/AppNavbar';
import NewTopHomeNextBar from '../../components2/NewTopHomeNextBar/NewTopHomeNextBar';
import NewBottomHomeNextBar from '../../components2/NewBottomHomeNextBar/NewBottomHomeNextBar';
//import HomeNextBar from "../../components2/HomeNextBar/HomeNextBar";
import content_list from '../../utils/Const/ContentJSON';
import home from '../../assests/Images/home.png';
import menu from '../../assests/Images/menu.png';
import next_nav from '../../assests/Images/next_nav.png';
import 'react-h5-audio-player/lib/styles.css';
import VoiceCompair from '../../components/VoiceCompair/VoiceCompair';
import refresh from '../../assests/Images/refresh.png';
import Animation from '../../components/Animation/Animation';

import { scroll_to_top } from '../../utils/Helper/JSHelper';

import play from '../../assests/Images/play-img.png';

import pause from '../../assests/Images/pause-img.png';

import next from '../../assests/Images/next.png';

/*chakra*/
import AppFooter from '../../components2/AppFooter/AppFooter';

function Score() {
  const navigate = useNavigate();
  const [isStart, set_isStart] = useState(false);
  const [numberOfPieces, set_numberOfPieces] = useState(0);
  const [flag, setFlag] = useState(true);
  const [content, set_content] = useState({});
  const [content_id, set_content_id] = useState(
    localStorage.getItem('contentid') ? localStorage.getItem('contentid') : 0
  );
  const [contenttype, set_contenttype] = useState(
    localStorage.getItem('contenttype')
      ? localStorage.getItem('contenttype')
      : 'Word'
  );
  const [isfromresult, set_isfromresult] = useState(
    localStorage.getItem('isfromresult')
      ? localStorage.getItem('isfromresult')
      : 'learn'
  );

  const [resultnext, set_resultnext] = useState(
    localStorage.getItem('resultnext') ? localStorage.getItem('resultnext') : ''
  );
  const [resultnextlang, set_resultnextlang] = useState(
    localStorage.getItem('resultnextlang')
      ? localStorage.getItem('resultnextlang')
      : 'en'
  );

  const [apphomelevel, set_apphomelevel] = useState(
    localStorage.getItem('apphomelevel')
      ? localStorage.getItem('apphomelevel')
      : 'Word'
  );

  const [temp_audio, set_temp_audio] = useState(null);
  const playAudio = () => {
    set_temp_audio(new Audio(recordedAudio));
  };
  const pauseAudio = () => {
    if (temp_audio !== null) {
      temp_audio.pause();
      setFlag(!false);
    }
  };
  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      setFlag(!flag);
      temp_audio.addEventListener('ended', () => setFlag(true));
      //temp_audio.addEventListener("ended", () => alert("end"));
    }
    return () => {
      if (temp_audio !== null) {
        temp_audio.pause();
      }
    };
  };

  useEffect(() => {
    learnAudio();
  }, [temp_audio]);
  const [load_cnt, set_load_cnt] = useState(0);

  const [sel_lang, set_sel_lang] = useState(
    localStorage.getItem('apphomelang')
      ? localStorage.getItem('apphomelang')
      : 'en'
  );

  useEffect(() => {
    if (load_cnt == 0) {
      set_content(content_list[content_id]);
      set_load_cnt(load_cnt => Number(load_cnt + 1));
      scroll_to_top('smooth');
    }
  }, [load_cnt]);

  const [recordedAudio, setRecordedAudio] = useState(
    localStorage.getItem('recordedAudio')
  );
  const [testResult, setTestResult] = useState('');
  const [teacherText, setTeacherText] = useState(
    localStorage.getItem('contentText')
  );
  const [voiceText, setVoiceText] = useState(localStorage.getItem('voiceText'));
  const [voiceTextTeacher, setVoiceTextTeacher] = useState('');
  const [voiceTextHighlight, setVoiceTextHighLight] = useState('');
  const [ocurracy_percentage, setOcurracy_percentage] = useState('');
  const [newtextresult, setnewtextresult] = useState('');
  const [fluencyresult, setfluencyresult] = useState('');

  useEffect(() => {
    if (voiceText !== '') {
      checkVoice(voiceText);
    }
  }, [voiceText]);
  function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }
  function checkVoice(voiceText) {
    let tempvoiceText = voiceText.toLowerCase();
    let tempteacherText = teacherText.toLowerCase();
    tempteacherText = replaceAll(tempteacherText, '.', '');
    tempteacherText = replaceAll(tempteacherText, "'", '');
    tempteacherText = replaceAll(tempteacherText, ',', '');
    tempteacherText = replaceAll(tempteacherText, '!', '');
    tempteacherText = replaceAll(tempteacherText, '|', '');
    setVoiceTextTeacher(tempteacherText);
    //alert(tempteacherText + "\n" + tempvoiceText);
    if (tempteacherText === tempvoiceText) {
      setTestResult(
        <font style={{ fontSize: '20px', color: 'green' }}>
          Teacher and Student audio match
        </font>
      );
      setnewtextresult(
        <font className="result_correct">Yay ! You got it right !</font>
      );
    } else {
      setTestResult(
        <font style={{ fontSize: '20px', color: 'red' }}>
          Teacher and Student audio does not match
        </font>
      );
      setnewtextresult(
        <font className="result_incorrect">Oops.. but you tried well!</font>
      );
    }
    //set text highlight
    let texttemp = voiceText.toLowerCase();
    const studentTextArray = texttemp.split(' ');
    const teacherTextArray = tempteacherText.split(' ');
    let student_text_result = [];
    let originalwords = teacherTextArray.length;
    let studentswords = studentTextArray.length;
    let wrong_words = 0;
    let correct_words = 0;
    let result_per_words = 0;
    for (let i = 0; i < studentTextArray.length; i++) {
      if (teacherTextArray.includes(studentTextArray[i])) {
        correct_words++;
        student_text_result.push(
          <>
            {' '}
            <font className="correct_text_remove">{studentTextArray[i]}</font>
          </>
        );
      } else {
        wrong_words++;
        student_text_result.push(
          <>
            {' '}
            <font className="inc_text">{studentTextArray[i]}</font>
          </>
        );
      }
    }
    setOcurracy_percentage(
      <>
        {' '}
        <font className="res_txt">{result_per_words}/100</font>
      </>
    );
    setVoiceTextHighLight(student_text_result);
    //calculation method
    if (originalwords >= studentswords) {
      result_per_words = Math.round(
        Number((correct_words / originalwords) * 100)
      );
    } else {
      result_per_words = Math.round(
        Number((correct_words / studentswords) * 100)
      );
    }
    set_numberOfPieces(result_per_words);
    set_isStart(true);

    //fluencytestresult
    if (result_per_words < 45) {
      setfluencyresult(
        <font className="result_incorrect">
          Needs to work on language skills
        </font>
      );
    } else if (result_per_words >= 45 && result_per_words <= 75) {
      setfluencyresult(
        <font className="result_incorrect">
          Good scope to improve language skills
        </font>
      );
    } else {
      setfluencyresult(
        <font className="result_incorrect">
          You have good level of language skills
        </font>
      );
    }

    setTestResult(
      <>
        <h5 className="home_sub_title">Word Result :</h5>
        <div className="res_txt">
          {originalwords < studentswords ? (
            <font style={{ color: 'red' }}>You have recorded extra word</font>
          ) : (
            <>{result_per_words}/100</>
          )}
        </div>
        <br />
        <font className="ori_res_txt">Original Words : {originalwords} | </font>
        <font className="stu_res_txt">Your Words : {studentswords} | </font>
        <font className="cor_res_txt">Correct Words : {correct_words} | </font>
        <font className="icor_res_txt">Incorrect Words : {wrong_words}</font>
        <hr />
        <h5 className="home_sub_title">Sentence Result :</h5>
        <div className="res_txt">
          {tempteacherText === tempvoiceText ? (
            <>
              <font style={{ color: 'green' }}>
                You recorded text match with content text
              </font>
            </>
          ) : (
            <>
              <font style={{ color: 'red' }}>
                You recorded text does not match with content text
              </font>
            </>
          )}
        </div>
        <br />
      </>
    );
  }
  function showScore() {
    return (
      <Animation size={15} isStart={isStart} numberOfPieces={numberOfPieces}>
        <div className="">
          <div className="row">
            <div className="col s12 m2 l3"></div>
            <div className="col s12 m8 l6 main_layout">
              {/*<AppNavbar navtitle="Result" />*/}
              <br />
              <NewTopHomeNextBar
                nextlink={resultnext}
                resultnextlang={resultnextlang}
                ishomeback={true}
              />
              <div>
                <center>
                  {/*<h5 className="home_title">Result</h5>
                  <hr />
                  {testResult}
                  <hr />*/}
                  {contenttype != 'Word' && numberOfPieces > 50 ? (
                    <>
                      <br />
                      <br />
                      <div className="res_txt">{numberOfPieces}/100</div>
                    </>
                  ) : (
                    ''
                  )}
                  <br />
                  <br />
                  {newtextresult}
                  <br />
                  <br />
                  {fluencyresult}
                  <br />
                  <br />
                  <div className="content_text_div_see">
                    {voiceTextHighlight}
                  </div>
                  <br />
                  {flag ? (
                    <>
                      <img
                        style={{
                          width: '72px',
                          height: '72px',
                          cursor: 'pointer',
                        }}
                        src={play}
                        onClick={() => playAudio()}
                      />
                      <p
                        style={{
                          position: 'relative',
                          marginTop: '-1px',
                          marginBottom: '-15px',
                          color: '#5286E4',
                          fontWeight: 600,
                        }}
                      >
                        Play
                      </p>
                    </>
                  ) : (
                    <>
                      <img
                        style={{
                          width: '72px',
                          height: '72px',
                          cursor: 'pointer',
                        }}
                        src={pause}
                        onClick={() => pauseAudio()}
                      />
                      <p
                        style={{
                          position: 'relative',
                          marginTop: '-1px',
                          marginBottom: '-15px',
                          color: '#5286E4',
                          fontWeight: 600,
                        }}
                      >
                        Pause
                      </p>
                    </>
                  )}

                  {/*<ReactAudioPlayer
                    autoPlay={false}
                    src={recordedAudio}
                    controls
                    style={{ width: "100%" }}
                  />*/}
                  <br />
                  <br />
                  <br />
                  {/*<font className="speech_title">Your Speech and Audio</font>
                  <div className="content_view">
                    <>
                      <font>
                        <br />
                        <b>{voiceTextHighlight}</b>
                        <br />
                        <br />
                        <ReactAudioPlayer
                          autoPlay={false}
                          src={recordedAudio}
                          controls
                          style={{ width: "100%" }}
                        />
                      </font>
                      <br />
                    </>
                  </div>
                  <font className="speech_title">
                    Original Speech and Audio
                  </font>
                  <div className="content_view">
                    <>
                      <font>
                        <br />
                        <b>{content[sel_lang]}</b>
                        <br />
                        <br />
                        <ReactAudioPlayer
                          autoPlay={false}
                          src={content[sel_lang + "_audio"]}
                          controls
                          style={{ width: "100%" }}
                        />
                      </font>
                      <br />
                    </>
                  </div>*/}
                </center>
              </div>
              {/*<HomeNextBar trylink={"startlearn"} ishomeback={true} />*/}

              <div className="app_footbar_remove">
                <div className="row" style={{ padding: '5px' }}>
                  {resultnext === '' || apphomelevel === 'Paragraph' ? (
                    <>
                      <div
                        className={
                          isfromresult === 'learn'
                            ? 'col s6 center'
                            : 'col s12 center'
                        }
                      >
                        <div
                          onClick={() => {
                            localStorage.setItem('trysame', 'yes');
                            navigate(-1);
                          }}
                        >
                          <img src={refresh} className="home_icon"></img>
                          <br />
                          try again
                        </div>
                      </div>
                      <div
                        className={
                          isfromresult === 'learn'
                            ? 'col s6 center'
                            : 'col s12 center hide'
                        }
                      >
                        <div onClick={() => navigate(-1)}>
                          <img src={refresh} className="home_icon"></img>
                          <br />
                          try new
                        </div>
                      </div>
                      <div className="col s6 center hide">
                        <Link
                          to={
                            isfromresult === 'learn'
                              ? '/proto2/start'
                              : '/proto2/'
                          }
                        >
                          <img
                            src={isfromresult === 'learn' ? menu : home}
                            className="home_icon"
                          ></img>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '74px',
                          marginTop: '-30px',
                        }}
                      >
                        <div
                        // className={
                        //   isfromresult === 'learn'
                        //     ? 'col s6 center'
                        //     : 'col s12 center'
                        // }
                        >
                          <div
                            onClick={() => {
                              localStorage.setItem('trysame', 'yes');
                              navigate(-1);
                            }}
                          >
                            <img src={refresh} className="home_icon"></img>
                            <br />
                            try again
                          </div>
                        </div>
                        <div
                        // className={
                        //   isfromresult === 'learn'
                        //     ? 'col s6 center'
                        //     : 'col s12 center hide'
                        // }
                        >
                          <div onClick={() => navigate(-1)}>
                            <img src={refresh} className="home_icon"></img>
                            <br />
                            try new
                          </div>
                        </div>
                      </div>
                      <div className="col s4 center hide">
                        <Link
                          to={
                            isfromresult === 'learn'
                              ? '/proto2/start'
                              : '/proto2/'
                          }
                        >
                          <img
                            src={isfromresult === 'learn' ? menu : home}
                            className="home_icon"
                          ></img>
                        </Link>
                      </div>
                      {/* <div className="col s12" style={{ textAlign: 'right' }}>
                        <Link
                          to={
                            isfromresult === 'learn'
                              ? '/proto2/startlearn'
                              : '/proto2/' + resultnext
                          }
                          onClick={() => {
                            //localStorage.setItem("apphomelang", resultnextlang);
                            const next_apphomelevel =
                              apphomelevel === 'Word'
                                ? 'Sentence'
                                : apphomelevel === 'Sentence'
                                ? 'Paragraph'
                                : 'Word';
                            localStorage.setItem(
                              'apphomelevel',
                              next_apphomelevel
                            );
                          }}
                        >
                          <img src={next_nav} className={'next_nav'}></img>
                        </Link>
                      </div> */}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="cols s12 m2 l3"></div>
          </div>
        </div>
        <AppFooter />
      </Animation>
    );
  }
  return <React.Fragment>{showScore()}</React.Fragment>;
}

export default Score;
