import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    marginTop: 8,
    fontSize: 16,
  },
  statusText: {
    marginTop: 4,
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicatorTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  indicatorLabel: {
    fontSize: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default styles;
