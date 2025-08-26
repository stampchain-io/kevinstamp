// All 104 Kevin stamp numbers from the updated data
export const kevinStampNumbers = [
  4258, 4265, 4283, 4303, 5096, 5097, 5104, 16494, 16495, 16496, 16497, 16498, 16499,
  17721, 17722, 18315, 18317, 18319, 18321, 18322, 18323, 18324, 18325, 18326,
  18327, 18328, 18329, 18330, 18332, 18333, 18335, 18336, 18338, 18339, 18340,
  18341, 18342, 18343, 18344, 18345, 18346, 18347, 18348, 18349, 18350, 18351,
  18352, 18353, 18354, 18355, 18356, 18357, 18358, 18359, 18360, 18361, 18362,
  18363, 18364, 18365, 18366, 18367, 18368, 18369, 18370, 18371, 18373, 18374,
  18375, 18376, 18379, 18380, 18381, 18382, 18386, 18387, 18390, 18393, 18394,
  18395, 18396, 18398, 18399, 18400, 18401, 18402, 18403, 18405, 18406, 18407,
  18408, 18409, 18410, 18412, 18415, 18418, 18419, 18420, 18421, 18422, 18424,
  18426, 18428, 18430
];

// Using the original Kevin image for all stamps since they are byte-perfect duplicates
export const getStampImageUrl = (stampNumber: number) => {
  // All Kevin stamps are byte-perfect duplicates of the original, so we use the same image
  // The original Kevin image hash from stamp #4258
  return "https://stampchain.io/content/6c7ff116f4ac8fe76d763946e9d917ca270f3b95c3b3949a478635fa617324ca.png";
};

export const getStampUrl = (stampNumber: number) => 
  `https://stampchain.io/stamp/${stampNumber}`;
