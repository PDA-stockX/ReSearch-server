import {notifyUsersOfNewReports, setSchedule} from "../services/schedule";

let cut;

beforeEach(() => {
    jest.useFakeTimers('modern')

    cut = {notifyUsersOfNewReports};
});

afterEach(() => {
    jest.clearAllTimers();
})

it('invokes .export() once, after 60 seconds have passed', () => {
    const notify = jest.spyOn(cut, 'notifyUsersOfNewReports');
    setSchedule(cut.notifyUsersOfNewReports);

    jest.advanceTimersByTime(1000 * 60 * 60 * 24);

    expect(notify).toHaveBeenCalledTimes(1);
});