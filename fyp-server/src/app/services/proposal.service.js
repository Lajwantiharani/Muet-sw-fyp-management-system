import tryCatch from '../../utils/libs/helper/try.catch.js';
import populateOptions from '../../utils/constants/populate.options.js';
import validateParameter from '../../utils/libs/helper/validate.parameter.js';
import validateMongooseObjectId from '../../utils/libs/database/validate.mongoose.object.id.js';
import Proposal from '../models/proposal.model.js';
import constructQuery from '../../utils/libs/database/construct.query.js';
import pagination from '../../utils/libs/database/pagination.js';
import getBatchQuery from '../../utils/libs/helper/getBatchQuery.js';

// function to retrieve all proposal documents
const retrieveAll = async (requestUser, status, { query = {}, current = 1, size = 10, sort = {} } = {}) => tryCatch(async () => {
    // constuct the query to search on fields
    const searchQuery = constructQuery(query, true);

    let queryStatus = [{ status }];
    if (["past", "supervised"].includes(status)) {
        queryStatus = [{ status: "accepted" }, { status: "conditionallyAccepted" }];
    } else if (status == "all") {
        queryStatus = [{}];
    }

    // calculate for past/current year of proposal
    const pastQuery = getBatchQuery("past",
        requestUser?.role == "supervisor" && status == "supervised"
            ? { supervisor: requestUser._id } : {}
    );

    const currentQuery = getBatchQuery("current",
        requestUser?.role == "supervisor" && status == "supervised"
            ? { supervisor: requestUser._id } : {}
    );


    // retrieve status based proposals
    const finalQuery = { $and: [{ $or: queryStatus }, ...[["past", "supervised"].includes(status) ? pastQuery : currentQuery], searchQuery] };

    // retrieve documents with pagination
    return await pagination(Proposal, { query: finalQuery, current, size, sort }, {
        populate: populateOptions.proposal
    });
});

// function to retrieve many project documents related to any query
const retrieveMany = async (roleQuery, { query = {}, current = 1, size = 10, sort = {} } = {}) => tryCatch(async () => {
    // constuct the query to search on fields
    const searchQuery = constructQuery(query, true);

    // merge queries to retrieve specified documents
    const finalQuery = { $and: [roleQuery, searchQuery] };

    // retrieve documents with pagination
    return await pagination(Proposal, { query: finalQuery, current, size, sort }, {
        populate: populateOptions.proposal
    });
});

// function to retrieve single specified proposal document
const retrieveOne = async (query) => {
    // convert ID string to mongoose ObjectId
    // const id = createMongooseObjectId(queryId);

    // construct the query to match proposal with any of the following fields
    // const query = {
    //     $or: [{ _id: id }, { lead: id }, { memberOne: id }, { memberTwo: id }]
    // }

    // return retrieved proposal document or null
    return await tryCatch(() => Proposal.findOne(query)
        .populate(populateOptions.proposal));
};

// function to create a new proposal document
const create = async (data) => {
    // validate query 
    validateParameter('object', data);

    // return newly created proposal document
    return await tryCatch(async () => {
        return (await Proposal.create(data))
            .populate(populateOptions.proposal);
    });
};

// function to update specified proposal document
const update = async (query, data) => {
    // validate query and data
    validateParameter('object', query, data);

    // attempt to update and retrieve old document
    return await tryCatch(() => {
        return Proposal.findOneAndUpdate(query, data, { new: true })
            .populate(populateOptions.proposal);
    });
};

// method to delete single specified proposal document
const del = async (id) => {
    // validate id is a valid mongoose ID
    validateMongooseObjectId(id);

    // delete and retrieve deleted proposal document
    return await tryCatch(() => {
        return Proposal.findByIdAndDelete(id)
            .populate(populateOptions.proposal);
    });
};

export default { retrieveAll, retrieveMany, retrieveOne, create, update, delete: del };