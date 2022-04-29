package main
import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
    "fmt"
    "crypto/aes"
      "crypto/sha256"
 "crypto/cipher"
 "io"
 "os"
 "bufio"
 "time"

)


func main(){

 r := bufio.NewReader(os.Stdin)
    fmt.Println("please Enter the plainText message::")
    data ,_:= r.ReadString('\n')
    data_byte := []byte(data)
t1 := time.Now()
priva, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
puba := priva.PublicKey

fmt.Printf("This is Private A Key is=== %v\n \n",priva)
fmt.Printf("This is Public A  key === %v\n\n",puba)
privb, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
pubb := privb.PublicKey
fmt.Printf("This is Private B Key is=== %v\n\n",privb)
fmt.Printf("This is Public B key === %v\n\n",pubb)
t2 := time.Now()

a, _ := puba.Curve.ScalarMult(puba.X, puba.Y, privb.D.Bytes())
b, _ := pubb.Curve.ScalarMult(pubb.X, pubb.Y, priva.D.Bytes())
fmt.Printf("a and b\n "a,b)
diff := t2.Sub(t1)
fmt.Println(diff)
fmt.Printf("\n %v \n %v",puba.X,puba.Y)
fmt.Printf("\n %v \n %v", pubb.X,pubb.Y)
fmt.Printf(" user a x and Y values X+Y ==%v\n",a)
fmt.Printf(" user b X and Y values X+Y ==%v\n",b)
shared1 := getHash1([]byte(a.String()))
shared2 := getHash1([]byte(b.String()))

fmt.Println("\n ***** shared1 key \n \n ",shared1)
fmt.Println("\n *** shared2 key \n \n ",shared2)

enc := encrypt(data_byte,shared1)
fmt.Printf("Cipher Text Data===:%x",enc)
dec := decrypt(enc,shared2)
fmt.Println(dec)
}




func encrypt(msg []byte,shared1 []byte) []byte {

    block, err := aes.NewCipher(shared1)
    aesgcm, err := cipher.NewGCM(block)
    nonceSize := aesgcm.NonceSize()
    nonce := make([]byte, aesgcm.NonceSize())
    if _,err := io.ReadFull(rand.Reader,nonce);err!=nil{}
    ciphertext := aesgcm.Seal(nonce, nonce, msg, nil)

    if err!=nil{
    fmt.Printf("%v",nonceSize)}

    return ciphertext

}



func decrypt(enc []byte ,shared2 []byte) (plainText string){
    block, err := aes.NewCipher(shared2)
    aesGCM, err := cipher.NewGCM(block)
    nonceSize := aesGCM.NonceSize()
    nonce, ciphertext := enc[:nonceSize], enc[nonceSize:]
    plaintext, err := aesGCM.Open(nil, nonce, ciphertext, nil)
    if err!=nil{}
    return fmt.Sprintf("\n\n%s \n ", plaintext)

}







func getHash1(x []byte ) []byte {
	hash256 := sha256.New()
	hash256.Write(x)
	fmt.Println(hash256)
	return hash256.Sum(nil)
}