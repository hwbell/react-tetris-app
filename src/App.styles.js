import constants from './Constants/gameConstants';

const fixedContainerWidth = 675;
const gameLostNoticeWidth = 0.6 * fixedContainerWidth;

const styles = { 
  mainContainerStyle: {
    margin: 'auto auto',
    position: 'relative',
    width: 700,
    height: 1000,
    border: '4px solid yellow',
    borderRadius: 4,
  },
  titleStyle: {
    color: 'white',
    fontFamily: 'Courier',
    margin: 50,
  },
  fixedContainerStyle: {
    width: fixedContainerWidth,
    position: 'absolute',
    left: '50%',
    marginLeft: -fixedContainerWidth / 2,
    border: '4px solid red',
    borderRadius: 4,
  },
  canvasHolderStyle: {
    width: fixedContainerWidth,
    position: 'relative',
    // margin: 20,
    // paddingRight: 25,
    border: '4px solid blue',
    borderRadius: 4,
  },
  canvasStyle: {
    width: constants.canvasWidth,
    height: constants.canvasHeight,
  },
  gameLostNoticeStyle: {
    width: '80%',
    position: 'absolute',
    left: '53%',
    top: '30%',
    zIndex: 1,
    color: 'white',
    fontSize: 20,
    marginLeft: -gameLostNoticeWidth / 3,
    background: 'rgba(0,0,0,0.5)',
  },

  saveScoreButtonStyle: {
    color: 'black',
    fontSize: 20,
    width: 60,
    height: 40,
    padding: 0,
    borderRadius: 14,
    marginBottom: 10,
  },

  startGameContainerStyle: {
    width: '70%',
    position: 'absolute',
    left: '58%',
    top: '40%',
    height: 120,
    borderRadius: 15,
    zIndex: 1,
    color: 'white',
    fontSize: 20,
    marginLeft: -gameLostNoticeWidth / 3,
    background: 'rgba(0,0,0,0.5)',
  },

  startGameButtonStyle: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 20,
    width: 130,
    height: 40,
    marginTop: 40,
    padding: 0,
    borderRadius: 14
  }
}

export default styles;