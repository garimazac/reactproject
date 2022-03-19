import {
  createTuit, deleteTuit,
  findTuitById, findAllTuits, findTuitByUser
} from "../services/tuits-service";

import {
  createUser,
  deleteUsersByUsername, findAllUsers,
  findUserById, deleteUser
} from "../services/users-service";

jest.setTimeout(10000);
const garimaUserId = "6232a9b56f257c8745ca292a";

let testUser = {
    username: "garry",
    password: "garry123"
};

const ripley = {
    username: 'garima',
    password: 'lv426',
    email: 'ellenripley@aliens.com'
};


describe('createTuit', () => {
const garimaTuit = {
       _id : "6201e1d072a0c6b894a99162",
      tuit: "My tuit for Cs5500"
    }
beforeAll(async () => {
            await deleteTuit(garimaTuit._id);
            return await deleteUsersByUsername(ripley.username);
        });

        afterAll(async () => {
            await deleteTuit(garimaTuit._id);
            return await deleteUsersByUsername(ripley.username);
        });
  test('can create tuit with REST API', async () => {


    const garima = await createUser(ripley);
    const newTuit = await createTuit(garima._id, garimaTuit);

    expect(newTuit.postedBy).toEqual(garima._id);
    expect(newTuit.tuit).toEqual(garimaTuit.tuit);

    const deletedCount = await deleteTuit(newTuit._id);
  });
});

describe("deleteTuit", () => {
    let garimaTuit = {
         _id: "6201e1d072a0c6b894a99162",
        tuit: "Hello World"
    };
    beforeAll(async () => {
            await deleteTuit(garimaTuit._id);
            return await deleteUsersByUsername(ripley.username);
        });

        afterAll(async () => {
            await deleteTuit(garimaTuit._id);
            return await deleteUsersByUsername(ripley.username);
        });

    test("can delete tuit with REST API", async () => {
        const garima = await createUser(ripley);
        garimaTuit = await createTuit(garima._id, garimaTuit);
        let userTuits = await findTuitByUser(garima._id);
        expect(userTuits.length).toEqual(1);

        const status = await deleteTuit(garimaTuit._id);
        expect(status.deletedCount).toEqual(1);
        userTuits = await findTuitByUser(garima._id);
        expect(userTuits.length).toEqual(0);
    });
});

describe("can retrieve a tuit by their primary key with REST API", () => {
    const tuit = {
        _id: "6201e1d072a0c6b894a99162",
        tuit: "This is my first Tuit",
    };

    beforeAll(async () => {
        await deleteTuit(tuit._id);
        return await deleteUsersByUsername(ripley.username);
    });

    afterAll(async () => {
        await deleteTuit(tuit._id);
        return await deleteUsersByUsername(ripley.username);
    });

    test("can retrieve a tuit by their primary key with REST API", async () => {
        const user = await createUser(ripley);
        await createTuit(user._id, tuit);
        const fetchTuit = await findTuitById(tuit._id);
        expect(fetchTuit.postedBy).toEqual(user);
        expect(fetchTuit.tuit).toEqual(tuit.tuit);
    });
});

describe("can retrieve all tuits with REST API", () => {
    const tuits = [
        {
            _id: "6201e1d072a0c6b894a99162",
            tuit: "First Tuit",
        },
        {
            _id: "6201e1d072a0c6b894a99163",
            tuit: "Second Tuit",
        },
        {
            _id: "6201e1d072a0c6b894a99164",
            tuit: "Third Tuit",
        },
    ];

    // setup test before running test
    beforeAll(async () => {
        // remove user and tuits to delete in test
        await Promise.all(
            tuits.map(async (tuit) => await deleteTuit(tuit._id))
        );
        return await deleteUsersByUsername(ripley.username);
    });

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        await Promise.all(
            tuits.map(async (tuit) => await deleteTuit(tuit._id))
        );
        return await deleteUsersByUsername(ripley.username);
    });

    test("can retrieve all tuits with REST API", async () => {
        const user = await createUser(ripley);
        await Promise.all(
            tuits.map(async (tuit) => {
                return await createTuit(user._id, tuit);
            })
        );

        const retrievedTuits = await findAllTuits();
        expect(retrievedTuits.length).toBeGreaterThanOrEqual(tuits.length);
        const tuitsWeInserted = retrievedTuits.filter(
            (tuit) => tuit.postedBy._id === user._id
        );

        tuitsWeInserted.forEach((tuitInserted) => {
            const tuit = tuits.find((tuit) => tuit._id === tuitInserted._id);
            expect(tuitInserted.tuit).toEqual(tuit.tuit);
            expect(tuitInserted.postedBy).toEqual(user);
        });
    });
});