import constants from '../Constants/gameConstants';

const canvasWidth = 450
const gameLostNoticeWidth = canvasWidth * 0.5;
const startGameWidth = canvasWidth * 0.5;

const styles = {
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
  gameLostMajorText: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
  },
  gameLostMinorText: {
    fontSize: 14,
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
}

export default styles;