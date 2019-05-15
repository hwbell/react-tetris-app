import constants from './Constants/gameConstants';

const canvasWidth = 450
const gameLostNoticeWidth = canvasWidth * 0.5;
const startGameWidth = canvasWidth * 0.5;

const styles = { 
  mainContainerStyle: {
    height: 50/*Title Margin */ + constants.squareSize*constants.gameHeight*1.2,
    // backgroundColor: 'black',
    borderRadius: 30,
  },
  titleStyle: {
    margin: 'auto',
    margin: 40,
    
  },
  gameContainerStyle: {
    borderRadius: 30,
    // width: 600,
    margin: '0 auto'
  },
  canvasHolderStyle: {
    // margin: 10,
    borderRadius: 30,
    // backgroundColor: 'white'
    //border: '4px solid brown',
    // focus
    //   outline: none,
  },
  canvasStyle: {
    // border: '4px solid brown',
    // borderRadius: 24,
    // backgroundColor: 'blue',
    margin: 0,
    padding: 0,
    width: constants.canvasWidth+25,
    minWidth: constants.canvasWidth+25,
    height: constants.canvasHeight,
  },

  startGameContainerStyle: {
    width: startGameWidth,
    position: 'absolute',
    left: '50%',
    top: '50%',
    height: 140,
    borderRadius: 15,
    zIndex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -startGameWidth*0.95,
    background: 'rgba(0,0,0,0.25)',
  },
  
  gameLostNoticeStyle: {
    //border: '4px solid black',
    borderRadius: 20,
    width: gameLostNoticeWidth,
    position: 'absolute',
    left: '50%',
    top: '25%',
    zIndex: 1,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: -gameLostNoticeWidth / 2,
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
    padding: 0,
    borderRadius: 14,
    marginBottom: 20,
  },
  submitNameStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    margin: 10,
    padding: 4,
    border: '1px solid whitesmoke',
    borderRadius: 10,
  },
  
}

export default styles;