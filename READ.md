var clubMberObj = {
  CLUB_SN : clubSn,
  MBER_NM : mberNm,
  MBER_SN : mberSn,
  MNGR_YN : 'Y',
  PROFILE_IMAGE : profileImage
};

//클럽회원 저장
var sql = "INSERT INTO CLUB_MBER SET ? "

dbconn.query(sql, clubMberObj, function(err, result){
	...
});
퀴리 set ㅡ로 변경하기