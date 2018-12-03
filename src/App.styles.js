import constants from './Constants/gameConstants';

const fixedContainerWidth = 750;
const gameLostNoticeWidth = 0.6 * fixedContainerWidth;



const styles = { 
  mainContainerStyle: {
    margin: 'auto auto',
    position: 'relative',
    width: 800,
    height: 1000,
    //border: '4px solid yellow',
    borderRadius: 30,
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
    //border: '4px solid red',
    borderRadius: 30,
  },
  canvasHolderStyle: {
    width: fixedContainerWidth * 0.6,
    position: 'relative',
    // margin: 20,
    // paddingRight: 25,
    //border: '4px solid blue',
    borderRadius: 30,
    // focus
    //   outline: none,
  },
  canvasStyle: {
    backgroundColor: 'black',
    // border: '4px solid brown',
    // borderRadius: 24,
    width: constants.canvasWidth+25,
    height: constants.canvasHeight,
  },
  gameLostNoticeStyle: {
    width: '70%',
    position: 'absolute',
    left: '50%',
    top: '30%',
    zIndex: 1,
    color: 'white',
    fontSize: 20,
    fontFamily: 'Courier',
    fontWeight: 'bold',
    marginLeft: -gameLostNoticeWidth / 3,
    background: 'rgba(0,0,0,0.65)',
  },
  gameLostText: {
    marginTop: 15,
  },
  saveScoreButtonStyle: {
    color: '#020825',
    width: 60,
    height: 40,
    padding: 0,
    borderRadius: 14,
    marginBottom: 20,
  },
  dontSaveButtonStyle: {
    color: '#020825',
    width: 60,
    height: 40,
    padding: 0,
    borderRadius: 14,
    marginBottom: 20,
  },
  startGameContainerStyle: {
    width: '70%',
    position: 'absolute',
    left: '50%',
    top: '40%',
    height: 120,
    borderRadius: 15,
    zIndex: 1,
    color: 'white',
    fontSize: 20,
    fontFamily: 'Courier',
    fontWeight: 'bold',
    marginLeft: -gameLostNoticeWidth / 3,
    background: 'rgba(0,0,0,0.65)',
  },

  startGameButtonStyle: {
    color: '#1A255C',
    //backgroundColor: 'white',
    fontSize: 18,
    fontFamily: 'Courier',
    fontWeight: '800',
    width: 130,
    height: 40,
    marginRight: 15,
    marginTop: 40,
    padding: 0,
    border: '4px solid white',
    borderRadius: 14
  }
}

export default styles;