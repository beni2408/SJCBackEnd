import MemberModel from "../models/memberModal.js";

export const generateMemberID = async (hometaxno) => {
  const existingMembers = await MemberModel.find({ hometaxno }).sort({ memberID: -1 });
  
  let sequence = 1;
  if (existingMembers.length > 0) {
    const lastMemberID = existingMembers[0].memberID;
    const lastSequence = parseInt(lastMemberID.slice(-4));
    sequence = lastSequence + 1;
  }
  
  const paddedHometaxno = hometaxno.toString().padStart(4, '0');
  const paddedSequence = sequence.toString().padStart(4, '0');
  return `MID${paddedHometaxno}${paddedSequence}`;
};