/**
 * Created by iilei on 29.01.17.
 */

/* eslint-disable */

it('should render', () => {
  const checkbox = shallow(
    <Main labelOn="On" labelOff="Off" />
  );

  checkbox.find('input').simulate('change');

  expect(checkbox).toMatchSnapshot();
});


import Main from '../main';

it('Main changes the text after click', () => {
  // Render a checkbox with label in the document
  const checkbox = shallow(
    <Main labelOn="On" labelOff="Off" />
  );

  expect(checkbox.text()).toEqual('Off');

  checkbox.find('input').simulate('change');

  expect(checkbox.text()).toEqual('On');
});
