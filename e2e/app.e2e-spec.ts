import { FitRockAppPage } from './app.po';

describe('fit-rock-app App', () => {
  let page: FitRockAppPage;

  beforeEach(() => {
    page = new FitRockAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
