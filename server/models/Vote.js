import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVotedYes: {
      type: Boolean,
      required: true,
    },
    votedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

voteSchema.statics.getResultsByPosition = async function () {
  return this.aggregate([
    {
      $lookup: {
        from: "candidates",
        localField: "candidate",
        foreignField: "_id",
        as: "candidate",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "voter",
        foreignField: "_id",
        as: "voter",
      },
    },
    { $unwind: "$candidate" },
    { $unwind: "$voter" },
    {
      $group: {
        _id: {
          position: "$candidate.position",
          candidateID: "$candidate.alias",
          candidateName: "$candidate.name",
          voterLevel: "$voter.level",
        },
        yesVotes: {
          $sum: { $cond: [{ $eq: ["$isVotedYes", true] }, 1, 0] },
        },
        noVotes: {
          $sum: { $cond: [{ $eq: ["$isVotedYes", false] }, 1, 0] },
        },
        totalVotes: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          position: "$_id.position",
          candidateID: "$_id.candidateID",
          candidateName: "$_id.candidateName",
        },
        levelBreakdown: {
          $push: {
            level: "$_id.voterLevel",
            yesVotes: "$yesVotes",
            noVotes: "$noVotes",
            totalVotes: "$totalVotes",
          },
        },
        totalYesVotes: { $sum: "$yesVotes" },
        totalNoVotes: { $sum: "$noVotes" },
        totalVotes: { $sum: "$totalVotes" },
      },
    },
    {
      $group: {
        _id: "$_id.position",
        candidates: {
          $push: {
            alias: "$_id.candidateID",
            name: "$_id.candidateName",
            yesVotes: "$totalYesVotes",
            noVotes: "$totalNoVotes",
            totalVotes: "$totalVotes",
            levelBreakdown: "$levelBreakdown",
          },
        },
        positionTotalVotes: { $sum: "$totalVotes" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
