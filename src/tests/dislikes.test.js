import {
    createUser,
    deleteUsersByUsername, findAllUsers,
    findUserById
} from "../services/users-service";
import {
    findAllTuits, findTuitById, findTuitByUser,
    createTuit, updateTuit, deleteTuit
} from "../services/tuits-service";
import {
    findAllTuitsDislikedByUser, findAllUsersThatDislikedTuit, userDislikesTuit
} from "../services/likes-service";
describe('dislike tuit with REST API', () => {
    // sample user to insert
    const author = {
        username: 'garima123',
        password: '123',
        email: 'garima@tuiter.com'
    };

    // sample tuit
    const tuit = {
        tuit: 'check tuit'
    };

    var userId;
    var tuitId;

    //setup test before running test
    beforeAll(async () => {
        // remove any/all users to make sure we create it in the test
        deleteUsersByUsername(author.username);

        // insert new user in the database
        const newUser = await createUser(author);
        userId = newUser._id;

        // insert new tuit
        const newTuit = await createTuit(newUser._id, tuit);
        tuitId = newTuit._id;

        // verify inserted tuit's properties match parameter tuit
        expect(newTuit.tuit).toEqual(tuit.tuit);
        expect(newTuit.postedBy).toEqual(newUser._id);
    })

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        deleteTuit(tuitId);
        return deleteUsersByUsername(author.username);
    })

    test('can dislike tuit', async () => {
        const originalTuit = await findTuitById(tuitId);
        expect(originalTuit.stats.dislikes).toEqual(0);
        await userDislikesTuit(userId, tuitId);
        const updatedTuit = await findTuitById(tuitId);
        expect(updatedTuit.stats.dislikes).toEqual(1);
    });

    test('find all disliked tuits', async () => {
        await userDislikesTuit(userId, tuitId);
        const dislikedTuits = await findAllTuitsDislikedByUser(userId);
        expect(dislikedTuits[0]._id).toEqual(tuitId);
    });
});

