const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            this.hasMany(models.Follow, {
                as: 'follows',
                foreignKey: 'userId',
                onDelete: 'CASCADE'
            });
        }

        static async signUp(email, password,name, nickname){
            const salt = await bcrypt.genSalt();

    static async signUp(email, password, name, nickname) {
      const salt = await bcrypt.genSalt();
      console.log(salt);

      try {
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.create({
          email,
          password: hashedPassword,
          name,
          nickname,
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          nickname: user.nickname,
        };
      } catch (err) {
        throw err;
      }
    }

    static async signIn(email, password) {
      const user = await this.findOne({ where: { email } });
      if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          return user.visibleUser;
        }
        throw Error("잘못된 비밀번호");
      }
      throw Error("잘못된 이메일");
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      nickname: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      visibleUser: {
        type: DataTypes.VIRTUAL,
        get() {
          return {
            id: this.id,
            email: this.email,
            name: this.name,
            nickname: this.nickname,
          };
        },
        set() {
          throw new Error("가상 필드입니다. 이 값을 설정할 수 없습니다.");
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
