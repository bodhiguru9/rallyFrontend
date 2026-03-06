Common fileds: -

 this.userType = data.userType; // 'player' or 'organiser'
    this.email = data.email;
    this.mobileNumber = data.mobileNumber;
    this.password = data.password;

Player fileds:-
   this.fullName = data.fullName;
      this.dob = data.dob;
      this.gender = data.gender;
      this.sport1 = data.sport1;
      this.sport2 = data.sport2;

organiser :-
this.fullName = data.fullName;
      this.yourBest = data.yourBest; // 'Organiser', 'coach', 'club'
      this.communityName = data.communityName;
      this.yourCity = data.yourCity;
      this.sport1 = data.sport1;
      this.sport2 = data.sport2;
      this.sports = data.sports || []; // Array for additional sports
      this.bio = data.bio;
      this.instagramLink = data.instagramLink; // Instagram profile link (optional)
      this.profileVisibility = data.profileVisibility || 'private'; // 'public' or 'private', default 'private'