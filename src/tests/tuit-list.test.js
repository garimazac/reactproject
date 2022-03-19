import Tuit from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits, deleteTuit, deleteTuitByContent, createTuit} from "../services/tuits-service";
import axios from "axios";

//jest.mock('axios');

const MOCKED_USERS = [
  "alice", "bob", "charlie"
];

const aliceId = "6201e0db72a0c6b894a9915d"
const bobId = "6201e39372a0c6b894a99165"
const aliceTuit = "6201e1d072a0c6b894a99162"
const bobTuit = "6201e0db72a0c6b894a9915d"
const MOCKED_TUITS = [
  {_id: aliceId, tuit: "Alice's tuit", postedBy: aliceTuit, postedOn: "2022-02-08T03:29:23.817Z"},
  {_id: bobId, tuit: "Bob's tuit", postedBy: bobTuit, postedOn: "2022-02-08T03:29:23.817Z"}
];

test('tuit list renders static tuit array', () => {
  render(
    <HashRouter>
      <Tuit tuits={MOCKED_TUITS}/>
    </HashRouter>);
  const linkElement = screen.getByText(/Alice/i);
  expect(linkElement).toBeInTheDocument();
});

test("tuit list renders async", async () => {
    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuit tuits={tuits} />
        </HashRouter>
    );
    const linkElement = screen.getByText(/spacecraft/i);
    expect(linkElement).toBeInTheDocument();
});

test('tuit list renders mocked', async () => {
const mock = jest.spyOn(axios, 'get');
  axios.get.mockImplementation(() =>
    Promise.resolve({data: {tuits: MOCKED_TUITS} }));
  const response = await findAllTuits();
  const tuits = response.tuits;

  render(
    <HashRouter>
      <Tuit tuits={tuits}/>
    </HashRouter>);

  const tuit = screen.getByText(/Bob/i);
  expect(tuit).toBeInTheDocument();
});


